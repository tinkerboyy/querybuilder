import React from 'react';
import Selector from './Selector';
import ValueEditor from './ValueEditor';
import QueryAction from './QueryAction';

const Rule = ({
  id,
  parentId,
  field,
  operator,
  value,
  translations,
  schema: {
    fields,
    getInputType,
    getLevel,
    getOperators,
    getValueEditorType,
    getValues,
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

  const onValueChanged = value => {
    onElementChanged('value', value);
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
        options={getOperators(field)}
        value={operator}
        handleOnChange={onOperatorChanged}
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
  schema: null
};

export default Rule;
