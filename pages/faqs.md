# FAQs

## Should I use class based views or function based views?

Class based views in Django might seem sexy on first impression, because they are so slim and resemble the basic CRUD operations.
And I believe they should be used for simple views.

But as soon as the view becomes more complex, for example with multiple forms, it becomes harder to follow the flow of the logic.
Besides, it is tempting to create a lot of mixins and overuse inheritance, which can be very dangerous for growing projects.
