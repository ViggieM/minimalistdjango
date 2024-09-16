---
tags:
  - tailwindcss
---

# Floating labels with Tailwindcss

Floating labels look amazing. Everybody likes them.
I am not a designer, and I have no idea about their downsides, but as a developer it is useful to know how to build them.
And because Tailwindcss is so awesome, I will build them with that.
Of course you can use also bootstrap for this.
But a real pro uses Tailwind.
Here is a video on how to build 'em:

<iframe class="youtube-iframe" src="https://www.youtube.com/embed/nJzKi6oIvBA?si=i40zgq_8FSO14cNv" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Video summary

Floating labels use the `peer` selector provided by Tailwindcss.
Because it is a "prevoius sibling" selector, it is essential that the `<label>` element comes after the `<input>` element.
The input element gets the class `peer`, and the label is styled based on whether the input element is **focused** or the **placeholder is shown**. Meanwhile, the label is placed in a position as if it was the placeholder text.
This way, the user thinks he is looking at a placeholder, while he is actually looking at the label.
Also, the surrounding `<div>` should be positioned relative, so we can absolutely position the label inside the input element.

So here is how the html would look like:

```html
<div class="relative">
  <input type="text" name="name" placeholder="Full name" id="id_name" class="peer">
  <label for="id_name">Full name</label>
</div>
```

Now we could use tailwindcss classes inside HTML to style both input and label, but why should we clutter our HTML unnecessarily?
We installed *django-tailwind* in the [previous post]({% link _posts/2023-09-19-tailwindcss.md %}) and it comes with the [tailwind forms plugin](https://v1.tailwindcss.com/components/forms).
Therefore we can achieve the styling just by adjusting the [`style.css`](https://tailwindcss.com/docs/adding-custom-styles).

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  [type="text"],
  [type="email"],
  [type="url"],
  [type="password"],
  [type="number"],
  [type="date"],
  [type="datetime-local"],
  [type="month"],
  [type="search"],
  [type="tel"],
  [type="time"],
  [type="week"],
  [multiple],
  textarea,
  select {
    @apply w-full pb-1.5 pt-6 border-grey-400 rounded
    text-sm placeholder-transparent
    hover:border-grey-700
    focus:border-blue-800 focus:ring-0;
  }
  [type="checkbox"],
  [type="radio"] {
    @apply border-gray-300 rounded text-indigo-600 focus:ring-indigo-500;
  }
  label {
    @apply text-xs absolute left-3 top-2
    peer-focus:top-2 peer-focus:text-xs
    peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm
    transition-all select-none cursor-text text-grey-500;
  }
}
```

Note the **peer-focus** and the **peer-placeholder-shown** states.
The **peer-focus** state should move the label up, as if the input was filled.
While the **peer-placeholder-shown** state means that the input is empty, so the label should be in the position of the placeholder.

Have fun styling!
