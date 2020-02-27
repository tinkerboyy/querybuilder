import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import './App.css';
import QueryBuilder from './queryBuilder/QueryBuilder';

const preparedFields = {
  primary: [
    { name: 'firstName', label: 'First Name' },
    { name: 'lastName', label: 'Last Name' }
  ],
  secondary: [
    { name: 'age', label: 'Age' },
    { name: 'isMusician', label: 'Is a musician' },
    { name: 'instrument', label: 'Instrument' }
  ],
  generic: [
    { name: 'firstName', label: 'First name' },
    { name: 'lastName', label: 'Last name' },
    { name: 'age', label: 'Age' },
    { name: 'gender', label: 'Gender' },
    { name: 'height', label: 'Height' },
    { name: 'job', label: 'Job' }
  ]
};

const preparedQueries = {
  primary: {
    id: `g-${uuid()}`,
    rules: [
      {
        id: `r-${uuid()}`,
        field: 'firstName',
        value: 'Steve',
        operator: 'equals'
      },
      {
        id: `r-${uuid()}`,
        field: 'lastName',
        value: 'Vai',
        operator: 'equals'
      }
    ],
    combinator: 'and',
    not: false
  },
  secondary: {
    id: `g-${uuid()}`,
    rules: [
      {
        field: 'age',
        id: `r-${uuid()}`,
        operator: '>',
        value: '28'
      },
      {
        field: 'isMusician',
        id: `r-${uuid()}`,
        operator: 'equals',
        value: true
      },
      {
        field: 'instrument',
        id: `r-${uuid()}`,
        operator: '=',
        value: 'Guitar'
      }
    ],
    combinator: 'or',
    not: false
  },
  generic: {
    combinator: 'and',
    not: false,
    rules: []
  }
};

const getOperators = field => {
  switch (field) {
    case 'instrument':
    case 'isMusician':
      return [{ name: '=', label: 'is' }];

    default:
      return null;
  }
};

const getValueEditorType = (field, operator) => {
  switch (field) {
    case 'gender':
      return 'radio';

    case 'instrument':
      return 'select';

    case 'isMusician':
      return 'checkbox';

    default:
      return 'text';
  }
};

const getInputType = (field, operator) => {
  switch (field) {
    case 'age':
      return 'number';

    default:
      return 'text';
  }
};

const getValues = (field, operator) => {
  switch (field) {
    case 'instrument':
      return [
        { name: 'Guitar', label: 'Guitar' },
        { name: 'Piano', label: 'Piano' },
        { name: 'Vocals', label: 'Vocals' },
        { name: 'Drums', label: 'Drums' }
      ];

    case 'gender':
      return [
        { name: 'M', label: 'Male' },
        { name: 'F', label: 'Female' },
        { name: 'O', label: 'Other' }
      ];

    default:
      return [];
  }
};

function App() {
  const [query, setQuery] = useState(preparedQueries.primary);
  const [fields, setFields] = useState(preparedFields.primary);
  const [format, setFormat] = useState('json');
  const [
    showCombinatorsBetweenRules,
    setShowCombinatorsBetweenRules
  ] = useState(false);
  const [showNotToggle, setShowNotToggle] = useState(false);
  const [resetOnFieldChange, setResetOnFieldChange] = useState(true);

  const loadQuery = target => {
    if (target) {
      setQuery(preparedQueries[target]);
      setFields(preparedFields[target]);
    } else {
      setQuery(preparedQueries.generic);
      setFields(preparedFields.generic);
    }
  };

  const handleQueryChange = query => {
    setQuery(query);
  };

  return (
    <div>
      <button onClick={() => loadQuery('primary')}>Load primary query</button>

      <QueryBuilder
        query={query}
        fields={fields}
        controlClassnames={{ fields: 'form-control' }}
        onQueryChange={handleQueryChange}
        getOperators={getOperators}
        getValueEditorType={getValueEditorType}
        getInputType={getInputType}
        getValues={getValues}
        showCombinatorsBetweenRules={showCombinatorsBetweenRules}
        showNotToggle={showNotToggle}
        resetOnFieldChange={resetOnFieldChange}
      />
    </div>
  );
}

export default App;
