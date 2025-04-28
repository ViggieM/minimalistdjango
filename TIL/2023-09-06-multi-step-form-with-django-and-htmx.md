---
title: Build a multi-step form with Django and htmx
pubDate: 2023-09-06
tags:
  - htmx
  - django
---

# Build a multi-step form with Django and htmx

I created a form wizard with Django and HTMX, without saving any intermediate data to the database or session.
Submitted data from earlier steps can be saved as hidden inputs in the next steps.
At the end, we can provide a preview view, to review the data before submitting and persisting it to the database.

## Build the edit view

We start off with a regular django form

```python
class AwesomeForm(forms.Form):
    ...
```

and use it in a view.
This view will accept GET and POST requests.
On a GET request it will initially render the form.
On a POST request it will simply render the form and its values. We will make use of that to create the **back** button in the preview view.

```python
@require_http_methods(["GET", "POST"])
def edit_form(request):
    if request.method == "POST":
        form = AwesomeForm(data=request.POST)
        return TemplateResponse(request, "_edit_form.html", {"form": form})
    form = AwesomeForm()
    return TemplateResponse(request, "_edit_form.html", {"form": form})
```

For the template we use a base template `base.html`, and a partial template `_edit_form.html` that will only contain the **form** element.
Note the **hx-headers** attribute of the **body** tag in `base.html`.
This sets the csrf header for HTMX requests.

```html
<!doctype html>
<html lang="en">
  <head>
    ...
    <script src="{% static 'htmx.min.js' %}"></script>
  </head>
  <body hx-headers='{"X-CSRFToken": "{{ csrf_token }}"}'>
    <div id="awesome-form">
      {% include "_edit_form.html" %}
    </div>
  </body>
</html>
```

And this is the `_edit_form.html`.
It makes use of the **hx-target** attribute to swap the div with the id **awesome-form**

```html
<form hx-post="{% url 'preview_form' %}" hx-target="#awesome-form">
    ...
    <button>Preview</button>
</form>
```

## Add more steps

Adding more steps to the wizard is simple.
We simply create a new view, that contains both the form from the previous view as hidden inputs,
as well as the new form that is visible and can be edited.

The steps can be navigated via POST requests, and every time we have form errors, we can nicely render them with django builtin utility attributes.

![flowchart-2024-09-16-2346-white-bg.png](/media/TIL/2023-09-06-multi-step-form-with-django-and-htmx/flowchart-2024-09-16-2346-white-bg.png)


## Build the preview view

When the "Preview" button is pressed, then a POST request is made to the preview view.
It only accepts POST requests, because if the form is not valid, we want to render the `_edit_form.html` partial with the form errrors.

```python
@require_http_methods(["POST"])
def preview_form(request):
    form = AwesomeForm(data=request.POST)
    if form.is_valid():
        return TemplateResponse(request, "_preview_form.html", {"form": form})
    return TemplateResponse(request, "_edit_form.html", {"form": form})
```

If it _is_ valid, it renders `_preview_form.html`, where instead of input fields we only render the values and renders hidden input fields instead.
This form also contains a "Back" button, that simply re-POSTs it's data to the edit view, so we can comfortably re-edit it.

```html
<form hx-post="{% url 'submit_form' %}" hx-target="#awesome-form">
    ...
    {% for field in form %}
        {{ field.as_hidden }}
    {% endfor %}
    ...
    <button hx-post="{% url 'edit_form' %}" hx-target="#awesome-form">Back</button>
    <button>Submit</button>
</form>
```

Finally, when we press the "Submit" button, this truly submits the form to the `submit_form` view.

```python
@require_http_methods(["POST"])
def submit_form(request):
    form = AwesomeForm(data=request.POST)
    if form.is_valid():
        # do something with the form data then return a thank you page
        return TemplateResponse(request, "thank_you.html", {"form": form})
    return TemplateResponse(request, "_edit_form.html", {"form": form})
```

## Limitations

* This method will not work for file uploads because we can't keep them between POST requests.
  For this, we probably have to do some javascript magic to keep them in the local storage, until the final form submission.
