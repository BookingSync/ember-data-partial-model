module.exports = {
  scenarios: [
    {
      name: '2.0',
       dependencies: {
        'ember': '2.0.3',
        'ember-data': '2.0.1',
        "ember-cli-shims": "0.0.6",
      }
    },
    {
      name: '2.1',
       dependencies: {
        'ember': '2.1.2',
        'ember-data': '2.1.0',
        "ember-cli-shims": "0.0.6",
      }
    },
    {
      name: '2.2',
       dependencies: {
        'ember': '2.2.2',
        'ember-data': '2.2.1',
        "ember-cli-shims": "0.0.6",
      }
    },
    {
      name: '2.3',
       dependencies: {
        'ember': '2.3.2',
        'ember-data': '2.3.3',
        "ember-cli-shims": "0.1.0",
      }
    },
    {
      name: '2.4',
       dependencies: {
        'ember': '2.4.6',
        'ember-data': '2.4.3',
        "ember-cli-shims": "0.1.0",
      }
    },
    {
      name: '2.5',
       dependencies: {
        'ember': '2.5.1',
        'ember-data': '2.5.3',
        "ember-cli-shims": "0.1.0",
      }
    },
    {
      name: '2.6',
       dependencies: {
        'ember': '2.6.2',
        'ember-data': '2.6.1',
        "ember-cli-shims": "0.1.0",
      }
    },
    {
      name: '2.7',
       dependencies: {
        'ember': '2.7.0',
        'ember-data': '2.7.0',
        "ember-cli-shims": "0.1.0",
      }
    },
    {
      name: 'default',
      dependencies: {

      }
    },
    {
      name: 'ember-release',
      dependencies: {
        'ember': 'components/ember#release'
      },
      resolutions: {
        'ember': 'release'
      }
    },
    {
      name: 'ember-beta',
      dependencies: {
        'ember': 'components/ember#beta'
      },
      resolutions: {
        'ember': 'beta'
      }
    },
    {
      name: 'ember-canary',
      dependencies: {
        'ember': 'components/ember#canary'
      },
      resolutions: {
        'ember': 'canary'
      }
    }
  ]
};
