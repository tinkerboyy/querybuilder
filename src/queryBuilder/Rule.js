import React from 'react';
import Selector from './Selector';
import ValueEditor from './ValueEditor';
import QueryAction from './QueryAction';
import FunctionEditor from './FunctionEditor';

const Rule = ({
  id,
  parentId,
  field,
  operator,
  func,
  value,
  functionValue,
  translations,
  schema: {
    fields,
    getInputType,
    getLevel,
    getOperators,
    getFunctions,
    getValueEditorType,
    getValues,
    getFuncValues,
    onPropChange,
    onRuleRemove
  }
}) => {
  const onElementChanged = (property, value) => {
    onPropChange(property, value, id);
  };

  const onFieldChanged = value => {
    onElementChanged('field', value);
  };

  const onOperatorChanged = value => {
    onElementChanged('operator', value);
  };

  const onFunctionChanged = value => {
    onElementChanged('function', value);
  };

  const onValueChanged = value => {
    onElementChanged('value', value);
  };

  const onFunctionValueChanged = value => {
    onElementChanged('functionValue', value);
  };

  const removeRule = event => {
    event.preventDefault();
    event.stopPropagation();

    onRuleRemove(id, parentId);
  };

  const fieldData = fields.find(f => f.name === field) || null;
  const level = getLevel(id);

  return (
    <div className="rule" data-rule-id={id} data-level={level}>
      <Selector
        options={fields}
        title={translations.fields.title}
        value={field}
        operator={operator}
        className={`rule-fields`}
        handleOnChange={onFieldChanged}
        level={level}
      />
      <Selector
        field={field}
        fieldData={fieldData}
        title={translations.operators.title}
        options={getFunctions(field)}
        value={func}
        handleOnChange={onFunctionChanged}
        level={level}
      />
      <Selector
        field={field}
        fieldData={fieldData}
        title={translations.operators.title}
        options={getOperators(field)}
        value={operator}
        handleOnChange={onOperatorChanged}
        level={level}
      />
      <FunctionEditor
        field={field}
        fieldData={fieldData}
        title={translations.value.title}
        operator={operator}
        value={functionValue}
        type={getValueEditorType(field, operator)}
        inputType={getInputType(field, operator)}
        values={getFuncValues(field, operator)}
        handleOnChange={onFunctionValueChanged}
        level={level}
      />
      <ValueEditor
        field={field}
        fieldData={fieldData}
        title={translations.value.title}
        operator={operator}
        value={value}
        type={getValueEditorType(field, operator)}
        inputType={getInputType(field, operator)}
        values={getValues(field, operator)}
        handleOnChange={onValueChanged}
        level={level}
      />
      <QueryAction
        label={translations.removeRule.label}
        title={translations.removeRule.title}
        handleOnClick={removeRule}
        level={level}
      />
    </div>
  );
};

Rule.defaultProps = {
  id: null,
  parentId: null,
  field: null,
  operator: null,
  value: null,
  schema: null,
  func: null
};

export default Rule;
