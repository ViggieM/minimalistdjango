---
title: "Floating labels for select fields"
date: 2023-10-26
published: true
author: victor
tags:
  - tailwindcss
categories:
  - Frontend
excerpt: "How to create floating labels for select fields"
---

Generally, select fields are a pain in the ass to style.
But if you want to keep it simple, and use the default style for the options, but at least have the select field match your style, than you can use following snippet:

```html
<div class="relative">
    <select name="gender" id="gender" onclick="this.setAttribute('value', this.value);" value="">
        <option value="" class="hidden"></option>
        <option value="1">male</option>
        <option value="2">female</option>
        <option value="3">something else</option>
    </select>
    <label for="gender">Gender</label>
</div>
```

And extend the `style.css` used in the main post on [floating labels]({% link _posts/2023-09-21-floating-labels.md %}) with:
```css
select:has([value=""]) ~ label {
  @apply top-4 text-sm
}
select:not([value=""]) ~ label {
  @apply top-2 text-xs
}
```

Here is how it works:
* The css selectors obviously are required for the positioning of the label. But they also depend on the value of the select element
* The select element initially has a value of "", and it also needs to dynamically change it with `onclick="this.setAttribute('value', this.value);"`, otherwise it will just stay empty and the label will remain in its initial centered position, instead of moving to the top left
* We also need an empty option, which we should hide, otherwise the option's text and the label will overlap
