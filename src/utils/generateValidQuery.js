import { v4 as uuid } from 'uuid';
import { isRuleGroup } from '.';

const generateValidQuery = query => {
  if (isRuleGroup(query)) {
    return {
      id: query.id || `g-${uuid()}`,
      rules: query.rules.map(rule => generateValidQuery(rule)),
      combinator: query.combinator,
      not: !!query.not
    };
  }
  return {
    id: query.id || `r-${uuid()}`,
    ...query
  };
};

export default generateValidQuery;
