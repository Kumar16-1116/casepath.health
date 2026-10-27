# CasePath

**CasePath is a browser-based project by Kumaraswamy K., MSc Health Data Science. It makes published cancer treatment statistics easier to explore and gives healthcare providers another source of information to consider during care discussions.**

## Why I created CasePath

A family member’s cancer-care experience inspired me to look for clearer ways to understand treatment information. During that experience, our family heard different care plans and found it difficult to compare them. I began wondering whether public cancer statistics could be easier to explore and discuss.

CasePath is my response to that question: a simple way to browse published treatment patterns. It does not recommend care or replace conversations with a healthcare professional.

## What you can do

- Search published statistics by cancer type.
- Select an age group, a cancer stage, or both.
- View recorded treatment patterns as counts, percentages, and confidence intervals.
- Switch between treatment combinations and individual treatment types.
- See the data source alongside the results.

When both age group and stage are selected, the site shows **two separate summaries**. The source data does not provide a combined result for a particular age group and stage.

## Data source

The site includes a local copy of public **NHS England National Disease Registration Service (NDRS) Cancer Treatments** statistics for diagnoses from **2013–2022**. The source dashboard was last updated on **29 May 2025**.

- [NHS England NDRS Cancer Treatments](https://digital.nhs.uk/ndrs/data/data-outputs/cancer-data-hub/cancer-treatments)
- Reuse is under the [Open Government Licence v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).

The figures describe **tumour records in groups**, not individual patient journeys. For individual treatment types, a tumour may appear in more than one category, so percentages may add up to more than 100%.

## How it works

CasePath is built with HTML, CSS, and JavaScript. The statistics are included in the `data` folder, and the browser filters that file when a visitor searches. The current version does not use an AI model, connect to a live NHS service, or store patient information.

## Privacy and feedback

Search selections are used in the visitor’s browser and are not saved or sent by the site. The site does not ask visitors to enter patient records. The feedback page opens an email draft; feedback is sent only if the visitor chooses to send it.

For questions or feedback, email [kumaraswamyk1611@gmail.com](mailto:kumaraswamyk1611@gmail.com).

## Important limitations

CasePath is an educational web prototype, **not clinical advice or a treatment recommendation tool**. Its public statistics cannot show what is best for a particular person, and the prototype has not been clinically validated. Treatment decisions belong with the patient and their healthcare team.

## Website files

- `index.html` — main page and statistics search
- `styles.css` — page styling
- `data/search.js` — browser search and results display
- `data/nhs_treatment_statistics.js` — bundled public statistics
- `privacy.html`, `feedback.html`, `contact.html` — information and contact pages
- `assets/` — image assets

Keep these files and folders together when hosting the site so the search and pages can load correctly.

