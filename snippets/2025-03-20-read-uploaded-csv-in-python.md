---
title: Django CSV File Upload Reader - Handle Uploaded CSV Files
shortDescription: A utility function to read and parse uploaded CSV files in Django forms with automatic delimiter detection
pubDate: 2025-03-20
tags:
  - Django
---

This utility function handles CSV file uploads in Django forms by properly decoding the file content and automatically detecting the CSV delimiter. It's particularly useful when users upload CSV files with different formats or encodings.

**Key features:**
- **Encoding handling**: Supports UTF-8 with BOM and normalizes line endings
- **Auto-detection**: Uses CSV sniffer to detect delimiter automatically
- **Error handling**: Falls back gracefully when delimiter detection fails
- **Memory efficient**: Uses StringIO for in-memory processing

```python
import csv
import io


def read_uploaded_csv(form):
    csv_file = form.cleaned_data["csv_file"]
    decoded_file = csv_file.read().decode("utf-8-sig").replace("\r\n", "\n").replace("\r", "\n")

    text_stream = io.StringIO(decoded_file)
    sniffer = csv.Sniffer()
    try:
        dialect = sniffer.sniff(text_stream.read(1024))  # Read a small chunk to detect delimiter
    except csv.Error as e:
        # in case there is only one column, the sniffer fails to detect the delimiter
        text_stream.seek(0)
        return csv.DictReader(text_stream)
    else:
        text_stream.seek(0)
        return csv.DictReader(text_stream, dialect=dialect)
```
