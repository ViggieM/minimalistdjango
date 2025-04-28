---
title: Custom select dropdown with search in Alpine.js
pubDate: 2023-09-22
tags:
  - Alpine.js
---

# Custom select dropdown with search in Alpine.js

Styling select dropdowns has always been a hustle in HTML.
One caveat is that it is possible to style the appearence of the `<select>` element, but not the `<option>`.
This might become history once the `<selectmenu>` element will be supported by the majority of browsers, but for now we need to find a simple solution.

Thanks to Alpine.js, this is not so difficult, and we can even extend it with a search input to filter the options.
I used some ideas from [this example]((https://tailwindcomponents.com/component/tailwindcss-and-alpinejs-custom-select-input)) I found online, but I changed some of the underlying principles, because I was not happy with the user experience or reliability.
It is not as "complete" as the one in the example, but it works smoother, in my opinion.

## The base HTML

The underlying principle is simple:
* We have one `<input>` field where you can type some text in
* We have a hidden `<select>` field with a bunch of options, let's say countries
* When we search for a term, the results are filtered and displayed in a `<ul>` as `<li>` elements, which can easily be styled
* When we click on one of the list elements, we change the value of the hidden select field
This way we have no magic happenning when we submit the form, since all we have is still just a select field in the end.

```html
<div>
    <input type="text" id="countries_search">
    <label for="countries_search">Countries</label>
    <!-- here comes the ul later -->
    <label for="id_countries" class="hidden">Countries
        <select name="countries" id="id_countries">
            <option value="DE">Germany</option>
            <option value="GB">Great Britain</option>
            ...  <!-- more options -->
        </select>
    </label>
</div>
```

## Filter the options

For now we don't have any Alpine.js yet.
Let's start using it, by adding the `x-data` attribute to the surrounding `<div>`.

```html
<div x-data>
    ...
</div>
```

Next, we want to type something in the input box, and filter the options.
Therefore we add the `@change` attribute to the `<input>` element, and a function that filters the select options by their label.
We also need a reference to the `<select>` element, so we can easily get all the available options.

```html
<div x-data>
    <input type="text" id="countries_search" @change="search">
    ...
    <select name="countries" id="id_countries" x-ref="select">
        ...
    </select>
</div>
<script>
    function search(evt) {
        const searchKeyword = evt.target.value
        const options = [...this.$refs.select.options].map(o => ({text: o.text, value: o.value}))
        const filteredOptions = options.filter(o => o.text.toLowerCase().includes(searchKeyword.toLowerCase()))
        // do something with the filtered options
    }
</script>
```

## Display the filtered options in an unordered list

Actually, now, let's display the filtered options.
For this, we make use of the [`<template>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) element.

```html
<div x-data>
    <input type="text" id="countries_search" @change="search">

    <ul>
        <template x-for="option in filteredOptions" :key="index">
            <li x-text="option.text"></li>
        </template>
    </ul>

    <select name="countries" id="id_countries" x-ref="select">
        ...
    </select>
</div>
```

We have a problem now, because *filteredOptions* is not found.
So we need to initialize *x-data* differently, to give it a context.

```html
<div x-data="select()">
...
</div>
<script>
    function select() {
        return {
            search: function(evt) {
                ...
            }
        }
    }
</script>
```

Now we can also initialize the options in an `init()` and change the *filteredOptions* when searching.

```html
<script>
    function select() {
        return {
            options: [],
            filteredOptions: [],
            init: function () {
                this.options = [...this.$refs.select.options].map(o => ({text: o.text, value: o.value}))
                this.filteredOptions = [...this.options]
            },
            search: function(evt) {
                const searchKeyword = evt.target.value
                this.filteredOptions = this.options.filter(o => o.text.toLowerCase().includes(searchKeyword.toLowerCase()))
            }
        }
    }
</script>
```

## Update the select element

By now, the filtered options are displayed in an unordered list based on the value in the input field.
Now we need to modify the value of the select when one of the list elements is clicked.
We do this by adding the `@click` attribute to the list elements.
Let's also change the value of the search input when we select an option, so we need to add a reference to that too.

```html
<input type="text" id="countries_search" @change="search" x-ref="input">

<ul>
    <template x-for="option in filteredOptions" :key="index">
        <li x-text="option.text" @click="selectOption(option)"></li>
    </template>
</ul>

<script>
    function select() {
        return {
            ...
            selectOption(option) {
                this.$refs.select.value = option.value
                this.$refs.input.value = option.text
            },
        }
    }
</script>
```

## Hide the unordered list when the select is not "active"

One additional thing that will be required is to open and close the dropdown when we focus the input or click away.
For this, we add a new value *isOpen* [^1], which is initially *false*.
When we click on the input field, we set it to *true* (`@focus="isOpen = true"`), and when we select a value or click outside of the select we set it back to *false* (`@click.away`).
And when *isOpen* is true, we show the unordered list (`x-show="isOpen"`), otherwise it's hidden.

## Here is the complete code

```html
<div x-data="select()" @click.away="isOpen = false">
    <input type="text" id="countries_search" @change="search" x-ref="input" @focus="isOpen = true">

    <ul x-show="isOpen">
        <template x-for="option in filteredOptions" :key="index">
            <li x-text="option.text" @click="selectOption(option)"></li>
        </template>
    </ul>

    <select name="countries" id="id_countries" x-ref="select">
        ...
    </select>
</div>

<script>
    function select() {
        return {
            isOpen: false,
            options: [],
            filteredOptions: [],
            init: function () {
                this.options = [...this.$refs.select.options].map(o => ({text: o.text, value: o.value}))
                this.filteredOptions = [...this.options]
            },
            search: function(evt) {
                const searchKeyword = evt.target.value
                this.filteredOptions = this.options.filter(o => o.text.toLowerCase().includes(searchKeyword.toLowerCase()))
            },
            selectOption(option) {
                this.$refs.select.value = option.value
                this.$refs.input.value = option.text
                this.isOpen = false  // <-- set to false after Option is selected
            },
        }
    }
</script>
```

This should do the trick.
From here, you can start styling your elements and make the unordered list appear like a dropdown by placing it absolute, and what not.


[^1]: Better call it "isOpen" than "open", because "open" might be misinterpreted as an action, while "isOpen" clearly describes the state.
