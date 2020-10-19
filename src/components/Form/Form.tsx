import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Input from '../Input/Input';
import config from '../../config/contactFormConfig.json';
import { createContact } from '../../redux/contacts/contact.actions';

interface IConfig {
  elementType: string;
  elementConfig: {
    name: string;
    label: string;
    type: string;
    required: boolean;
    errorMessage: string;
    placeholder: string;
  };
  value: string;
  invalid: boolean;
  shouldValidate: {
    required: true;
    minLength: string;
    maxLength: string;
  };
  touched: boolean;
}

interface IContact {
  id: string;
  name: string;
  phone: number;
  created?: Date;
}

interface IProps {
  createContact: (formData: IContact) => void;
}

const Form: React.FC<IProps> = ({ createContact }) => {
  const history = useHistory();

  const [contactForm, setContactForm] = useState(config);
  const [formIsValid, setFormIsValid] = useState(false);

  const formElements = [];

  for (let key in contactForm) {
    formElements.push({
      id: key,
      // @ts-ignore
      config: contactForm[key] as IConfig,
    });
  }

  const inputChangeHandler = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    inputIdentifier: string
  ) => {
    const updatedContactForm = { ...contactForm };
    //@ts-ignore
    const updatedFormElement = { ...updatedContactForm[inputIdentifier] };

    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = checkValidity(
      updatedFormElement.value,
      updatedFormElement.validation
    );
    updatedFormElement.touched = true;
    //@ts-ignore
    updatedContactForm[inputIdentifier] = updatedFormElement;

    let formIsValid = true;
    for (let inputIdentifier in updatedContactForm) {
      //@ts-ignore
      formIsValid = updatedContactForm[inputIdentifier].valid && formIsValid;
    }

    setContactForm(updatedContactForm);
    setFormIsValid(formIsValid);
  };

  const submitFormHandler = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    event.preventDefault();
    const formData = {};
    for (let formElementIdentifier in contactForm) {
      //@ts-ignore
      formData[formElementIdentifier] =
        //@ts-ignore
        contactForm[formElementIdentifier].value;
    }

    // @ts-ignore
    createContact(formData);
    history.push('/');
  };

  const checkValidity = (
    value: string,
    rules: { required?: boolean; minLength?: number; maxLength?: number }
  ) => {
    let isValid = true;

    if (!rules) {
      return true;
    }

    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    return isValid;
  };

  return (
    <form onSubmit={submitFormHandler} className='measure center'>
      <fieldset id='sign_up' className='ba b--transparent ph0 mh0'>
        {formElements.map((formElement) => (
          <Input
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            inputChangeHandler={(event) =>
              inputChangeHandler(event, formElement.id)
            }
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
          />
        ))}
        <div className='tc'>
          <input type='submit' disabled={!formIsValid} />
        </div>
      </fieldset>
    </form>
  );
};

export default connect(null, { createContact })(Form);
