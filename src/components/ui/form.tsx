import { createContext, PropsWithChildren, ReactNode, useContext, useId } from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
  useFormState,
} from 'react-hook-form';
import { uiColors } from '@/theme/uiColors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';
import { mergeStyles } from '@/lib/style';

/**
 * RN adaptation of shadcn's form.tsx (https://ui.shadcn.com/docs/components/form).
 *
 * Usage — note the `field.onChange` / `field.blur` naming, NOT a raw `{...field}` spread:
 *
 * ```tsx
 * const form = useForm({ defaultValues: { username: '' } });
 *
 * <Form {...form}>
 *   <FormField
 *     control={form.control}
 *     name="username"
 *     render={({ field }) => (
 *       <FormItem>
 *         <FormLabel>Username</FormLabel>
 *         <FormControl>
 *           <Input value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} />
 *         </FormControl>
 *         <FormDescription>This is your public display name.</FormDescription>
 *         <FormMessage />
 *       </FormItem>
 *     )}
 *   />
 * </Form>
 * ```
 *
 * Why `onChangeText={field.onChange}` is safe: react-hook-form's `field.onChange` normally
 * expects a DOM ChangeEvent (it reads `event.target.value`), which is why the web version of
 * this file can get away with `{...field}` spread onto a plain `<input>`. RN's `TextInput`
 * has no DOM event — `onChangeText` calls back with the raw string directly. Fortunately
 * react-hook-form's `onChange` also accepts a bare value (it checks whether the argument looks
 * like an event via `event?.target` and falls back to using the argument itself when it isn't
 * event-shaped), so passing the raw string straight through from `onChangeText` works correctly.
 * `field.onBlur` needs no adaptation — it already takes zero arguments, same as `TextInput`'s
 * `onBlur`. We still avoid a bare `{...field}` spread, though: `field.ref` expects a DOM-style
 * `focus()`-only handle, and spreading also silently forwards `field.name`/`field.value` typed
 * for HTML inputs, so call sites should wire each prop explicitly as shown above instead.
 */

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

type FormItemContextValue = {
  id: string;
};

const FormItemContext = createContext<FormItemContextValue | null>(null);

function useFormField() {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext?.name });

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }
  if (!itemContext) {
    throw new Error('useFormField should be used within <FormItem>');
  }

  const fieldState = getFieldState(fieldContext.name, formState);

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
}

interface FormItemProps {
  style?: ViewStyle;
}

function FormItem({ style, children }: PropsWithChildren<FormItemProps>) {
  const id = useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <View style={mergeStyles<ViewStyle>(styles.item, style)}>{children}</View>
    </FormItemContext.Provider>
  );
}

interface FormLabelProps {
  style?: TextStyle;
}

function FormLabel({ style, children }: PropsWithChildren<FormLabelProps>) {
  const { error } = useFormField();

  return (
    <Text style={mergeStyles<TextStyle>(styles.label, error && styles.labelError, style)}>{children}</Text>
  );
}

interface FormControlProps {
  children: ReactNode;
}

/**
 * Web's <FormControl> wires up aria-describedby/aria-invalid onto its single child via
 * Radix's <Slot>. There's no DOM/aria equivalent in RN, so this stays a plain passthrough —
 * kept as a named component only so `<FormControl><Input/></FormControl>` composition still
 * reads the same as the shadcn original.
 */
function FormControl({ children }: FormControlProps) {
  return <>{children}</>;
}

interface FormDescriptionProps {
  style?: TextStyle;
}

function FormDescription({ style, children }: PropsWithChildren<FormDescriptionProps>) {
  return <Text style={mergeStyles<TextStyle>(styles.description, style)}>{children}</Text>;
}

interface FormMessageProps {
  style?: TextStyle;
}

function FormMessage({ style, children }: PropsWithChildren<FormMessageProps>) {
  const { error } = useFormField();
  const body = error ? String(error?.message ?? '') : children;

  if (!body) {
    return null;
  }

  return <Text style={mergeStyles<TextStyle>(styles.message, style)}>{body}</Text>;
}

const styles = StyleSheet.create({
  item: {
    gap: spacing.xs,
  },
  label: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
    color: uiColors.foreground,
  },
  labelError: {
    color: uiColors.destructive,
  },
  description: {
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    color: uiColors.mutedForeground,
  },
  message: {
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    color: uiColors.destructive,
  },
});

export { useFormField, Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField };
