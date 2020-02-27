const isRuleGroup = ruleOrGroup => {
  return !!(ruleOrGroup.combinator && ruleOrGroup.rules);
};

export default isRuleGroup;
