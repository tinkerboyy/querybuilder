import React from 'react';
import Selector from './Selector';
import QueryAction from './QueryAction';
import Rule from './Rule';

const RuleGroup = props => {
  const { id, parentId, combinator, rules, translations, schema, not } = props;
  const {
    classNames,
    combinators,
    createRule,
    createRuleGroup,
    getLevel,
    isRuleGroup,
    onGroupAdd,
    onGroupRemove,
    onPropChange,
    onRuleAdd,
    showCombinatorsBetweenRules
  } = schema;

  const hasParentGroup = () => !!parentId;
  const level = () => getLevel(id);

  const addRule = event => {
    event.preventDefault();
    event.stopPropagation();

    const newRule = createRule();
    onRuleAdd(newRule, id);
  };

  const addGroup = event => {
    event.preventDefault();
    event.stopPropagation();

    const newGroup = createRuleGroup();
    onGroupAdd(newGroup, id);
  };

  const removeGroup = event => {
    event.preventDefault();
    event.stopPropagation();

    onGroupRemove(id, parentId);
  };

  const onCombinatorChange = value => {
    onPropChange('combinator', value, id);
  };

  return (
    <div className="ruleGroup">
      <div className="ruleGroup-header">
        {showCombinatorsBetweenRules ? null : (
          <Selector
            options={combinators}
            value={combinator}
            title={translations.combinators.title}
            handleOnChange={onCombinatorChange}
            rules={rules}
            level={level}
          />
        )}
        <QueryAction
          label={translations.addRule.label}
          title={translations.addRule.title}
          handleOnClick={addRule}
          rules={rules}
          level={level}
        />
        <QueryAction
          label={translations.addGroup.label}
          title={translations.addGroup.title}
          handleOnClick={addGroup}
          rules={rules}
          level={level}
        />
        {hasParentGroup() ? (
          <QueryAction
            label={translations.removeGroup.label}
            title={translations.removeGroup.title}
            handleOnClick={removeGroup}
            rules={rules}
            level={level}
          />
        ) : null}
      </div>
      {rules.map((r, idx) => (
        <React.Fragment key={r.id}>
          {idx && showCombinatorsBetweenRules ? (
            <Selector
              options={combinators}
              value={combinator}
              title={translations.combinators.title}
              className={`ruleGroup-combinators betweenRules ${classNames.combinators}`}
              handleOnChange={onCombinatorChange}
              rules={rules}
              level={level}
            />
          ) : null}
          {isRuleGroup(r) ? (
            <RuleGroup
              id={r.id}
              schema={schema}
              parentId={id}
              combinator={r.combinator}
              translations={translations}
              rules={r.rules}
              not={r.not}
            />
          ) : (
            <Rule
              id={r.id}
              field={r.field}
              functionValue={r.functionValue}
              value={r.value}
              operator={r.operator}
              func={r.function}
              schema={schema}
              parentId={id}
              translations={translations}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default RuleGroup;
