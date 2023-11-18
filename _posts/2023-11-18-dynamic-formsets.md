---
layout: post
title: "Dynamic formsets with Alpine.js"
date: 2023-11-18
published: false
author: victor
tags:
  - Alpine.js
categories:
  - Frontend
excerpt: "How to dynamically add and remove forms in django formsets with Alpine.js"
---

```html
{% raw %}<form x-data="formset">
  <template>
    <div class="form">
      {{ formset.empty_form }}
      <button type="button" @click="deleteForm()">Delete form</button>
    </div>
  </template>
  <button type="button" @click="addForm()">Add form</button>
  {{ formset.management_form }}
  <div class="forms">
    {% for form in formset %}
    <div class="form">
      {{ form }}
      <button type="button" @click="deleteForm()">Delete form</button>
    </div>
    {% endfor %}
  </div>
</form>{% endraw %}
```

```js
Alpine.data('formset', () => ({
  get totalFormsInput() {
    return this.$root.querySelector(`input[name$='-TOTAL_FORMS']`)
  },
  addForm() {
    const template = this.$root.querySelector('template')
    const formsContainer = this.$root.querySelector('.forms')
    const form = template.content.cloneNode(true)

    // replace __prefix__ with the correct index
    for (let el of form.querySelectorAll('input, select, textarea')) {
      if (el.name.includes('__prefix__')) {
        el.name = el.name.replace('__prefix__', formsContainer.children.length)
      }
      if (el.id.includes('__prefix__')) {
        el.id = el.id.replace('__prefix__', formsContainer.children.length)
      }
    }
    const labels = form.querySelectorAll('label')
    for (let el of labels) {
      if (el.htmlFor.includes('__prefix__')) {
        el.htmlFor = el.htmlFor.replace('__prefix__', formsContainer.children.length)
      }
    }

    formsContainer.appendChild(form)
    this.totalFormsInput.value = parseInt(this.totalFormsInput.value) + 1
  },
  deleteForm() {
    // adjust the total forms input
    this.totalFormsInput.value = parseInt(this.totalFormsInput.value) - 1

    // adjust the ids of the remaining inputs
    const formsContainer = this.$root.querySelector('.forms')
    const form = this.$el.closest('.form')
    form.remove()

    for (let i = 0; i < formsContainer.children.length; i++) {
      const form = formsContainer.children[i]
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
  }
}))
```
