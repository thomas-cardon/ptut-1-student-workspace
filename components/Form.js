import React from 'react';
import * as Fields from "./FormFields";

const Form = React.forwardRef(({ onSubmit, fields, className, style, children }, ref) => {
  return (<form ref={ref} className={className} style={style} onSubmit={onSubmit}>
    {children}
    </form>);
});

export default Form;
