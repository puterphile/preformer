# Preformer

Preformer is a library for pre-forming application's form; validate form's submitions

```bash
npm install preformer
```

## Example

_An example of contact form in typescript react_

```tsx
import { yup, usePreformer } from "preformer";

const schema = yup.object({
  email: yup.string().email(),
  message: yup.string().min(4),
});

function Contact() {
  const [ref, { exception }] = usePreformer(schema, (e, data) => {
    console.log("Contact submission successed.", data);
  });

  return (
    <form ref={ref}>
      {!!exception && <span>{exception.message}</span>}
      <input type="text" name="email" />
      <input type="text" name="message" />
      <input type="submit" value="submit" />
    </form>
  );
}
```
