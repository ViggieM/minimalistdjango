---
title: Loading spinners for htmx requests
pubDate: 2023-10-13
shortDescription: Learn how to implement loading spinners for HTMX requests using Tailwind CSS, with two different approaches for better user feedback during form submissions.
tags:
  - Frontend
keywords: htmx, loading indicators, spinners, user feedback, css animations
---


Htmx is pretty awesome for forms (see my [previous article](/TIL/2023-09-06-multi-step-form-with-django-and-htmx) on how to build a form wizard with htmx), and you can handle some pretty complex things with just a few attributes.
Sometimes when you submit a form, the response comes very fast from the server, and you don't even notice the delay, especially during local development.
But in production, the response might take a bit longer, either because the processing of the form takes a while, or because there is no available worker to handle the request.
Therefore, you need to let the user know that some kind of processing is happening in the background.

For this, there is the "hx-indicator" attribute that controls the visibility of some kind of indicator while the request is on flight.
It adds the class **"htmx-request"** to the element specified by a css selector, or to the element that triggers the htmx request.
In case of a form where the "submit" button is pressed, this will be the form itself.
This can be used to show some kind of loading spinner while the request is being processed.
There are two ways you can do this.

## Use the "htmx-request" class directly to reduce the opacity of the form

We can apply some styling to the "htmx-request" class itself and use the `::after` element as the gray background overlay, and the `::before` element as a loading spinner.
This is also nice, because we can add the `pointer-events-none` to the form and prevent the user to interact with the form while the request is in flight.
Here is how the css (tailwind) would look like:

```css
@layer utilities {
  .htmx-request {
    @apply relative pointer-events-none
  }

  .htmx-request > * {
    @apply opacity-70;
  }

  .htmx-request::after {
    @apply content-[''] opacity-30
    absolute top-0 bottom-0 left-0 right-0
    bg-gray-300 bg-cover;
  }

  .htmx-request::before {
    @apply content-[''] animate-spin-translate
    block z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
    w-12 h-12 border-4 rounded-full border-white border-b-transparent;
  }
}
```

I had to extend the `animate-spin` class to include the translation of the `::before` element, because the rotation is overriden by the classes `-translate-x-1/2` and `-translate-y-1/2`, and this makes the animation move the spinner diagonally instead of rotating.
So here is how I extended the animations in tailwindcss with `animate-spin-translate` to include `translate(-50%,-50%)`:

```javascript
theme: {
    extend: {
        keyframes: {
        'spin-translate': {
            '0%': { transform: 'translate(-50%,-50%) rotate(0deg)'},
            '100%': { transform: 'translate(-50%,-50%) rotate(360deg)'}
        },
        },
        animation: {
        'spin-translate': 'spin-translate 700ms infinite linear',
        }
    },
},
```

The `.htmx-request > *` selector also reduces the opacity of all the child elements to make the distinction clearer to the user.



## Use a backdrop


The previous version works pretty fine, but it has one downside.
If the element, for example a big form with a lot of inputs, is bigger than the screen, then the loading spinner will appear somewhere random on the page, and the user will not see it.
Therefore you can add a backdrop that is initially hidden, and it appears when it gets the "htmx-request" class.

```html
<body hx-headers='{"X-CSRFToken": "{{ csrf_token }}"}'>
    ...
    <div class="backdrop">
        <span class="loading-spinner"></span>
    </div>
    ...
</body>
```