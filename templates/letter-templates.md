# Letter Templates

These are the templates from the `Templates` tab. Tokens in `{{DOUBLE_BRACES}}` are filled from the tracker row. See [`../tracker/tracker-schema.md`](../tracker/tracker-schema.md#template-tokens).

> The Spanish and Haitian Creole versions are first drafts written to match the English tone. They should be reviewed by a fluent speaker before real use.

---

## English

**Subject:** Thank you for your donation to Linden Street Community Partners!

```
Hi {{FIRST}},

Thank you so much for your gift of {{AMOUNT}}, which we received on {{DATE}}.{{PROGRAM}}{{TRIBUTE}}

{{DONOR_LINE}}

Support from neighbors like you helps us keep showing up for our community. We're grateful you're part of it.

If you ever have questions, or just want to say hi, you can reply right to this email.

For your tax records: Linden Street Community Partners' EIN is {{EIN}}. No goods or services were provided in exchange for this gift.

Warmly,
Priya Raman
Development and Communications Manager
Linden Street Community Partners
```

- **First-time line:** It means a lot that you chose to support Linden Street for the first time. We're really glad to have you with us.
- **Repeat line:** You've given to Linden Street before, and we don't take that for granted. Thank you for sticking with us.
- **Program line:** ` Your gift is going straight to support {{PROGRAM_NAME}}.`

---

## Spanish

**Subject:** ¡Gracias por tu donación a Linden Street Community Partners!

```
Hola {{FIRST}},

Muchas gracias por tu donación de {{AMOUNT}}, que recibimos el {{DATE}}.{{PROGRAM}}{{TRIBUTE}}

{{DONOR_LINE}}

El apoyo de vecinos como tú nos ayuda a seguir presentes para nuestra comunidad. Estamos agradecidos de que seas parte de ella.

Si tienes alguna pregunta, o simplemente quieres saludarnos, puedes responder directamente a este correo.

Para tus registros fiscales: el EIN de Linden Street Community Partners es {{EIN}}. No se proporcionaron bienes ni servicios a cambio de esta donación.

Con cariño,
Priya Raman
Gerente de Desarrollo y Comunicaciones
Linden Street Community Partners
```

- **First-time line:** Nos alegra mucho que hayas decidido apoyar a Linden Street por primera vez. Qué bueno tenerte con nosotros.
- **Repeat line:** Ya nos habías apoyado antes, y eso no lo damos por sentado. Gracias por seguir con nosotros.
- **Program line:** ` Tu donación va directamente a apoyar {{PROGRAM_NAME}}.`

---

## Haitian Creole

**Subject:** Mèsi pou don ou bay Linden Street Community Partners!

```
Bonjou {{FIRST}},

Mèsi anpil pou don {{AMOUNT}} ou te fè a. Nou te resevwa l nan dat {{DATE}}.{{PROGRAM}}{{TRIBUTE}}

{{DONOR_LINE}}

Sipò vwazen tankou ou ede nou kontinye la pou kominote nou an. Nou rekonesan paske ou fè pati l.

Si ou gen kesyon, oswa si ou jis vle di bonjou, ou ka reponn dirèkteman nan imèl sa a.

Pou dosye taks ou: EIN Linden Street Community Partners se {{EIN}}. Nou pa t bay okenn byen oswa sèvis an echanj pou don sa a.

Ak tout kè nou,
Priya Raman
Manadjè Devlopman ak Kominikasyon
Linden Street Community Partners
```

- **First-time line:** Sa vle di anpil pou nou ke ou chwazi sipòte Linden Street pou premye fwa. Nou kontan anpil genyen ou avèk nou.
- **Repeat line:** Ou te sipòte Linden Street deja, e nou pa pran sa pou yon bagay nòmal. Mèsi paske ou rete avèk nou.
- **Program line:** ` Don ou an ap sèvi dirèkteman pou sipòte {{PROGRAM_NAME}}.`

---

## Localized month names (`Lookups` tab)

| # | English | Spanish | Haitian Creole |
|---|---|---|---|
| 1 | January | enero | janvye |
| 2 | February | febrero | févriye |
| 3 | March | marzo | mas |
| 4 | April | abril | avril |
| 5 | May | mayo | me |
| 6 | June | junio | jen |
| 7 | July | julio | jiyè |
| 8 | August | agosto | out |
| 9 | September | septiembre | septanm |
| 10 | October | octubre | oktòb |
| 11 | November | noviembre | novanm |
| 12 | December | diciembre | desanm |
