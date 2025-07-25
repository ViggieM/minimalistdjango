---
title: Dynamic Formsets with Alpine.js
pubDate: 2023-11-18
tags:
  - Frontend
keywords: django formsets, alpine.js, dynamic forms, form management, javascript
shortDescription: A guide on implementing interactive form management in Django using Alpine.js, allowing users to dynamically add and remove forms while maintaining proper formset functionality.
---


Django comes with builtin utilities for creating formsets (see [Formsets Django documentation](https://docs.djangoproject.com/en/4.2/topics/forms/formsets/)).
The disadvantage is that django templates are server side rendered, therefore there is no possibility for the user to add any extra forms interactively.
Therefor we need to use Javascript.

Django admin for example also takes care of this interactivity with **jQuery**.
We could obviously also write plain Javascript to accomplish that.
But the locality of behaviour principle can be accomplished very nicely with **Alpine.js**.

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="yLZrwea" data-user="viggiesmalls" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/viggiesmalls/pen/yLZrwea">
  Formset</a> by ViggieSmalls (<a href="https://codepen.io/viggiesmalls">@viggiesmalls</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

<br>

## Starting point

Let's start with a simple formset, that is rendered with django templates.
We will use the [ArticleFormSet](https://docs.djangoproject.com/en/4.2/topics/forms/formsets/) example from the django documentation.
Here is how the formset would be built in python code:

```python
from django import forms
from django.forms import formset_factory

class ArticleForm(forms.Form):
    title = forms.CharField()
    pub_date = forms.DateField()

ArticleFormSet = formset_factory(ArticleForm)
```

And here is how the formset would be rendered in a django template, without any interaction:

```html
<form>
    {{ formset.management_form }}
    {% for form in formset %}
        {{ form }}
    {% endfor %}
    <button>Submit</button>
</form>
```

In the following steps we will implement an `addForm` and `deleteForm` method and adjust the html to be able to make the formset interactive.

## Add a form to a Formset

Let's initialize the Alpine.js component with the `x-data` attribute on the `<form>` element and add a button that triggers the `addForm` method on click.

```html
<form x-data="formset">
    <button type="button" @click="addForm()">Add form</button>
    ...
</form>
```

Formsets created with the `formset_factory` have an attribute `empty_form`.
This can be used as a template for new forms, since names and ids of the fields of the form contain the `__prefix__` instead of a number, so we can easily replace it with an incremental number.
So the empty form can be packed inside a `template` tag and when copied we replace `__prefix__` with the number of forms present in the `forms` div, plus one.
We also need a button that triggers the `addForm` method on click.
Afterward we just need to append it inside the `forms` container.
The HTML would look something like this:

```html
<form x-data="formset">
    <button type="button" @click="addForm()">Add form</button>
    <template>
        {{ formset.empty_form }}
    </template>
    {{ formset.management_form }}
    <div class="forms">
        {% for form in formset %}
        {{ form }}
        {% endfor %}
    </div>
</form>
```

And the `addForm` Javascript code would look like this:

```javascript
const template = this.$root.querySelector('template')
const formsContainer = this.$root.querySelector('.forms')
const newForm = this.template.content.cloneNode(true)

// replace __prefix__ with the correct index
for (let el of newForm.querySelectorAll('input, select, textarea')) {
    if (el.name.includes('__prefix__')) {
        el.name = el.name.replace('__prefix__', formsContainer.children.length)
    }
    if (el.id.includes('__prefix__')) {
        el.id = el.id.replace('__prefix__', formsContainer.children.length)
    }
}
const labels = newForm.querySelectorAll('label')
for (let el of labels) {
    if (el.htmlFor.includes('__prefix__')) {
        el.htmlFor = el.htmlFor.replace('__prefix__', formsContainer.children.length)
    }
}

// append the new form to the dom
formsContainer.appendChild(newForm)
```

We also need to replace the number of total and initial forms in the management form

```javascript
const totalFormsInput = this.$root.querySelector(`input[name$='-TOTAL_FORMS']`)
const initialFormsInput = this.$root.querySelector('input[name$="-INITIAL_FORMS"]')

totalFormsInput.value = parseInt(totalFormsInput.value) + 1
initialFormsInput.value = parseInt(initialFormsInput.value) + 1
```


## Remove a form from the Formset

Removing a form has some implications.
We need to add a delete button for each form that is rendered within the "forms" `div`.
We also need to encompass every form with a "form" `div`, so we are able to select it with the [closest()](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest?retiredLocale=de) method and remove it from the DOM.

```html
<form x-data="formset">
    <template>
        <fieldset>
            {{ formset.empty_form }}
            <button type="button" @click="deleteForm()">Delete form</button>
        </fieldset>
    </template>
    {{ formset.management_form }}
    <div class="forms">
        {% for form in formset %}
        <fieldset>
            {{ form }}
            <button type="button" @click="deleteForm()">Delete form</button>
        </fieldset>
        {% endfor %}
    </div>
</form>
```

We could separate the HTML for the form and place it inside a template partial:

```html
<form x-data="formset">
    <template>
        {% include "form_template.html" with form=formset.empty_form %}
    </template>
    {{ formset.management_form }}
    <div class="forms">
        {% for form in formset %}
            {% include "form_template.html" %}
        {% endfor %}
    </div>
</form>
```

After removing a form from the DOM, we need to adjust the IDs of the remaining inputs, so they remain consecutively numbered.
This is required, because the `construct_forms` method expects the form inputs to be numbered consecutively.
And don't forget to adjust the management form.
Here is the corresponding Javascript code:

```javascript
this.$el.closest('fieldset').remove()

// adjust the ids of the remaining inputs
for (let i = 0; i < this.formsContainer.children.length; i++) {
    const form = this.formsContainer.children[i]
    const inputs = form.querySelectorAll('input, select, textarea')
    for (let el of inputs) {
        el.name = el.name.replace(/\d+/, i)
        el.id = el.id.replace(/\d+/, i)
    }
    const labels = form.querySelectorAll('label')
    for (let el of labels) {
        el.htmlFor = el.htmlFor.replace(/\d+/, i)
    }
}

// adjust the management form inputs
totalFormsInput.value = Math.max(0, parseInt(this.totalFormsInput.value) - 1)
initialFormsInput.value = Math.max(0, parseInt(this.initialFormsInput.value) - 1)
```

## Final thoughts

So now we have all we need for a dynamic formset, and I believe it is really portable and reusable for many cases.
I have also learned that the usage of `x-ref` should be restricted very carefully.
We could have also worked with `x-ref` attributes like `x-ref="forms"` or `x-ref="managementForm"` instead of querySelector.
But I had a discussion on the Alpine.js Discord chanel, and I was told that `x-ref` is probably a correct choice only in 1/100 cases, and that only for external libraries that rely on a React-style reference.
It's obvious that for our use case it is not necessary.
