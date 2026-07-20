# Analytics and attribution

## Website goals

Yandex Metrica counter: `110858833`.

| Goal | Recorded when | Source |
| --- | --- | --- |
| `telegram_click` | A visitor clicks any tracked Telegram CTA | Website |
| `vk_click` | A visitor clicks any tracked VK CTA | Website |
| `form_start` | A visitor first focuses a contact-form field | Website |
| `form_submit_success` | The contact API confirms a successful submission | Website |
| `diagnostic_booked` | A date and time for the diagnostic lesson are confirmed | CRM or lead sheet |
| `diagnostic_attended` | The student attends the diagnostic lesson | CRM or lead sheet |
| `qualified_lead` | The inquiry matches the target student, goal and budget | CRM or lead sheet |
| `paid_student` | The first lesson or package is paid | CRM or lead sheet |

Do not infer `diagnostic_booked` from a messenger click or form submission. These are different funnel stages.

Contact-form fields use Yandex Metrica's `ym-disable-keys` class so Session Replay masks the values visitors enter.

## UTM convention

Use lowercase values consistently. Example for an OGE search campaign:

```text
utm_source=yandex
utm_medium=cpc
utm_campaign=oge_9class_search
utm_content=diagnostic_result_proof
utm_term={keyword}
```

Keep `utm_campaign` stable for the campaign lifetime. Use `utm_content` to distinguish ads, proof points and creative variants.

## Lead reconciliation

Maintain one row per inquiry in a spreadsheet or CRM with these columns:

- `lead_id`
- `created_at`
- `student_grade`
- `service_interest`
- `contact_channel`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `diagnostic_booked_at`
- `diagnostic_attended_at`
- `qualified_lead_at`
- `paid_student_at`
- `first_payment_amount`
- `retained_month_2`

Reconcile the sheet with Metrica weekly. Optimize paid campaigns for the deepest goal that still produces enough weekly conversions; do not treat clicks or form starts as revenue events.
