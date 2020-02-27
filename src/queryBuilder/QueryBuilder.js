import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import cloneDeep from 'lodash/cloneDeep';
import { Formik, Form, Field, FieldArray } from 'formik';
import RuleGroup from './RuleGroup';
import { generateValidQuery, getLevel, findRule, isRuleGroup } from '../utils';

const defaultTranslations = {
  fields: {
    title: 'Fields'
  },
  operators: {
    title: 'Operators'
  },
  value: {
    title: 'Value'
  },
  removeRule: {
    label: 'x',
    title: 'Remove rule'
  },
  removeGroup: {
    label: 'x',
    title: 'Remove group'
  },
  addRule: {
    label: '+Rule',
    title: 'Add rule'
  },
  addGroup: {
    label: '+Group',
    title: 'Add group'
  },
  combinators: {
    title: 'Combinators'
  },
  notToggle: {
    title: 'Invert this group'
  }
};

const defaultOperators = [
  { name: 'includes', label: 'includes' },
  { name: 'startsWith', label: 'starts with' },
  { name: 'endsWith', label: 'ends with' },
  { name: 'equals', label: '= equals' },
  { name: 'notEquals', label: '!= not equals' },
  { name: 'test', label: 'test' },
  { name: 'indexOf', label: 'in' },
  { name: 'length', label: 'length' },
  { name: 'toLowerCase', label: 'lowercase' },
  { name: 'toUpperCase', label: 'uppercase' },
  { name: 'between', label: 'between' }
];

const defaultCombinators = [
  { name: 'and', label: 'AND' },
  { name: 'or', label: 'OR' }
];

const QueryBuilder = props => {
  const {
    translations,
    combinators,
    fields,
    query,
    operators,
    showCombinatorsBetweenRules,
    showNotToggle
  } = props;

  const getInitialQuery = () => {
    const { query } = props;
    return (query && generateValidQuery(query)) || createRuleGroup();
  };

  const createRule = () => {
    const field = fields[0].name;

    return {
      id: `r-${uuid()}`,
      field,
      value: '',
      operator: getOperators(field)[0].name
    };
  };

  const createRuleGroup = () => {
    return {
      id: `g-${uuid()}`,
      rules: [],
      combinator: combinators[0].name,
      not: false
    };
  };

  const getValueEditorType = (field, operator) => {
    if (props.getValueEditorType) {
      const vet = props.getValueEditorType(field, operator);
      if (vet) return vet;
    }

    return 'text';
  };

  const getInputType = (field, operator) => {
    if (props.getInputType) {
      const inputType = props.getInputType(field, operator);
      if (inputType) return inputType;
    }

    return 'text';
  };

  const getValues = (field, operator) => {
    if (props.getValues) {
      const vals = props.getValues(field, operator);
      if (vals) return vals;
    }

    return [];
  };

  const getOperators = field => {
    if (props.getOperators) {
      const ops = props.getOperators(field);
      if (ops) return ops;
    }

    return props.operators;
  };

  const getRuleDefaultValue = rule => {
    let value = '';

    const values = getValues(rule.field, rule.operator);

    if (values.length) {
      value = values[0].name;
    } else {
      const editorType = getValueEditorType(rule.field, rule.operator);

      if (editorType === 'checkbox') {
        value = false;
      }
    }

    return value;
  };

  const onRuleAdd = (rule, parentId) => {
    const rootCopy = { ...root };
    const parent = findRule(parentId, rootCopy);
    parent.rules.push({
      ...rule,
      value: getRuleDefaultValue(rule)
    });
    setRoot(rootCopy);
    _notifyQueryChange(rootCopy);
  };

  const onGroupAdd = (group, parentId) => {
    const rootCopy = { ...root };
    const parent = findRule(parentId, rootCopy);
    parent.rules.push(group);
    setRoot(rootCopy);
    _notifyQueryChange(rootCopy);
  };

  const onPropChange = (prop, value, ruleId) => {
    const rootCopy = { ...root };
    const rule = findRule(ruleId, rootCopy);
    Object.assign(rule, { [prop]: value });

    if (props.resetOnFieldChange && prop === 'field') {
      Object.assign(rule, {
        operator: getOperators(rule.field)[0].name,
        value: getRuleDefaultValue(rule)
      });
    }

    setRoot(rootCopy);
    _notifyQueryChange(rootCopy);
  };

  const onRuleRemove = (ruleId, parentId) => {
    const rootCopy = { ...root };
    const parent = findRule(parentId, rootCopy);
    const index = parent.rules.findIndex(x => x.id === ruleId);

    parent.rules.splice(index, 1);

    setRoot(rootCopy);
    _notifyQueryChange(rootCopy);
  };

  const onGroupRemove = (groupId, parentId) => {
    const rootCopy = { ...root };
    const parent = findRule(parentId, rootCopy);
    const index = parent.rules.findIndex(x => x.id === groupId);

    parent.rules.splice(index, 1);

    setRoot(rootCopy);
    _notifyQueryChange(rootCopy);
  };

  const getLevelFromRoot = id => {
    return getLevel(id, 0, root);
  };

  const _notifyQueryChange = newRoot => {
    const { onQueryChange } = props;
    if (onQueryChange) {
      const query = cloneDeep(newRoot);
      onQueryChange(query);
    }
  };

  const schema = {
    fields,
    combinators,
    createRule,
    createRuleGroup,
    onRuleAdd,
    onGroupAdd,
    onRuleRemove,
    onGroupRemove,
    onPropChange,
    getLevel: getLevelFromRoot,
    isRuleGroup,
    getOperators,
    getValueEditorType,
    getInputType,
    getValues,
    showCombinatorsBetweenRules,
    showNotToggle
  };

  const [root, setRoot] = useState(getInitialQuery());

  useEffect(() => {
    setRoot(generateValidQuery(query || getInitialQuery()));
  }, [query]);

  useEffect(() => {
    _notifyQueryChange(root);
  }, []);

  return (
    <div className="querybuilder">
      <RuleGroup
        translations={{ ...defaultTranslations, ...translations }}
        rules={root.rules}
        combinator={root.combinator}
        schema={schema}
        id={root.id}
        parentId={null}
        not={root.not}
      />
    </div>
  );
};

QueryBuilder.propTypes = {
  query: PropTypes.object,
  fields: PropTypes.array.isRequired,
  operators: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string, label: PropTypes.string })
  ),
  combinators: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string, label: PropTypes.string })
  )
};

QueryBuilder.defaultProps = {
  query: null,
  fields: [],
  operators: defaultOperators,
  combinators: defaultCombinators
};

export default QueryBuilder;
