import { useEffect, useRef, useState, RefObject, useCallback } from "react";
import { Schema } from "yup";

type HTMLSubmitEvent = HTMLElementEventMap["submit"];
type onSubmit = (this: HTMLSubmitEvent, e: HTMLSubmitEvent, data: any) => void;

interface Exception {
  path: string;
  cause: string;
}

export default function usePreformer(schema: Schema, onSubmit: onSubmit) {
  const reference = useRef<HTMLFormElement>(null);
  const [exception, setException] = useState<Exception | undefined>(undefined);

  const validate = useCallback(
    (schema: Schema) => {
      return new Promise((resolve) => {
        const { current: element } = reference;
        const data = Object.fromEntries(new FormData(element as any));
        schema
          .validate(data)
          .then((data) => (setException(undefined), resolve(data)))
          .catch((e) => setException({ cause: e.message, path: e.path }));
      });
    },
    [reference]
  );

  useEffect(() => {
    const { current: element } = reference;

    const handleSubmit = (e: HTMLSubmitEvent) => {
      e.preventDefault();
      validate(schema).then(onSubmit.bind(e, e));
    };
    element?.addEventListener("submit", handleSubmit);

    return () => {
      element?.removeEventListener("submit", handleSubmit);
    };
  }, [schema, validate]);

  const submit = () => reference.current?.requestSubmit();

  return [reference, { validate, exception, submit }] as [
    RefObject<HTMLFormElement>,
    any
  ];
}
