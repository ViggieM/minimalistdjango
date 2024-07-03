
- `<base target="_blank">`# HTML to PDF.md
- [Printing a Book with CSS: Boom! – A List Apart](https://alistapart.com/article/boom/)
- [CSS Paged Media Module Level 3](https://www.w3.org/TR/css-page-3/)
- Github [Repository search results](https://github.com/search?q=html+to+pdf&type=Everything&repo=&langOverride=&start_value=1&s=stars&o=desc)
- PDFs manuell erstellen:
	- https://realpython.com/podcasts/rpp/84/#t=2797
		- borb erlaubt es manuell zu steuern wie das PDF aussehen soll
	- https://github.com/pdfme/pdfme
		- Sehr interessant mit dem Umgang mit Templates, und ein ganz nettes designer tool um pdf templates zu erzeugen
	- leider ist es immer eine umständliche arbeit das HTML nochmal in PDF struktur umzuwandeln
- HTML zu PDF:
	- Setzen von `base` tag im HTML wichtig damit die statics geladen werden können
		- [html - WkHTMLtoPDF not loading local CSS and images - Stack Overflow](https://stackoverflow.com/questions/16627310/wkhtmltopdf-not-loading-local-css-and-images)
	- [wkhtmltopdf](https://wkhtmltopdf.org/)
		- ist bereits eingebaut in ubuntu
		- fürs erste nicht schlecht, aber:
			- [css - Does wkHTMLtoPDF support @page rules? - Stack Overflow](https://stackoverflow.com/questions/30165208/does-wkhtmltopdf-support-page-rules)
				- supportet keine @page rules
			- probleme mit Tailwind
				- font-family wurde nicht unterstützt, und es gab ein "Segmentation fault". Aber wenn man explizit die font anpasst in tailwindconfig, passt das
					- ```js
					    theme: {
					      fontFamily: {
					        sans: ['Lato', 'sans-serif'],
					        serif: ['Roboto Slab', 'serif'],
					      },
					    },
					  ```
					- ```css
					  @import url('https://fonts.googleapis.com/css2?family=Lato&display=swap');
					  @import url('https://fonts.googleapis.com/css2?family=Roboto+Slab&display=swap');
					  ```
		- ist archiviert seit Januar 2023: [wkhtmltopdf/wkhtmltopdf: Convert HTML to PDF using Webkit (QtWebKit)](https://github.com/wkhtmltopdf/wkhtmltopdf)
		- html muss mit tabels gestylt werden
	- Weasyprint [First Steps — WeasyPrint 60.1 documentation](https://doc.courtbouillon.org/weasyprint/stable/first_steps.html#installation)
		- hat 13 k sterne auf github [Kozea/WeasyPrint: The awesome document factory](https://github.com/Kozea/WeasyPrint)
		- Interessantes docker konzept als service
			- [dirtsimple/weasyprint - Docker Image | Docker Hub](https://hub.docker.com/r/dirtsimple/weasyprint)
	- Andere Alternativen: [15 Best Wkhtmltopdf Alternatives 2023](https://rigorousthemes.com/blog/best-wkhtmltopdf-alternatives/)
	-
