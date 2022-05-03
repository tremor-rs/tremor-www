// @ts-check
/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  communitySidebar: [
    {
      type: 'doc',
      id: 'community/overview',
      label: 'Community',
    },
    {
      'Governance': [
        'community/governance/overview',
        'community/governance/CodeofConduct',
        'community/governance/CII',
        'community/governance/Versioning',
        'community/governance/policies/security',
      ]
    },
    {
      'Development': [
        'community/development/overview',
        'community/development/quick-start',
        'community/development/testing',
        'community/development/debugging',
        'community/development/profiling',
        'community/development/benchmarking',
      ]
    },
    'community/teams',
    {
      'EventsAndMedia': [
        'community/events/overview',
        'community/events/TremorCon2021',
      ]
    },
    'community/faqs',
    'community/case-studies',
  ],

  gettingStartedSidebar: [
    {
      type: 'doc',
      id: 'getting-started/overview',
      label: 'Getting Started',
    },
    'getting-started/install',
    'guides/overview',
    'about/overview',
    'recipes/overview',
    'reference/connectors',
    'getting-started/tooling',
  ],

  connectorsSidebar: [
    {
      type: 'doc',
      id: 'reference/connectors',
      label: 'Connectors Reference',
    },
    /*
    {
      'Codecs': [
        'reference/codecs',
        'reference/codecs/json',
        'reference/codecs/yaml',
        'reference/codecs/csv',
        'reference/codecs/msgpack',
        'reference/codecs/string',
        'reference/codecs/influx',
        'reference/codecs/binflux',
        'reference/codecs/statsd',
        'reference/codecs/syslog',
      ]
    },
    {
      'Preprocessors': [
        'reference/preprocessors',
        'reference/preprocessors/base64',
        'reference/preprocessors/decompress',
        'reference/preprocessors/gelf',
        'reference/preprocessors/length-prefix',
        'reference/preprocessors/separate',
        'reference/preprocessors/remove-empty',
      ]
    },
    {
      'Postprocessors': [
        'reference/postprocessors',
        'reference/postprocessors/base64',
        'reference/postprocessors/compress',
        'reference/postprocessors/gelf',
        'reference/postprocessors/ingest-timestamp',
        'reference/postprocessors/length-prefix',
        'reference/postprocessors/separate',
      ]
    },
    {*/
    {
      type: 'doc',
      id: 'reference/connectors/bench',
      label: 'bench',
    },
    {
      type: 'doc',
      id: 'reference/connectors/cb',
      label: 'cb',
    },
    {
      type: 'doc',
      id: 'reference/connectors/crononome',
      label: 'crononome',
    },
    {
      type: 'doc',
      id: 'reference/connectors/discord',
      label: 'discord',
    },
    {
      type: 'doc',
      id: 'reference/connectors/dns',
      label: 'dns',
    },
    {
      type: 'doc',
      id: 'reference/connectors/elastic',
      label: 'elastic',
    },
    {
      type: 'doc',
      id: 'reference/connectors/file',
      label: 'file',
    },
    {
      type: 'doc',
      id: 'reference/connectors/kafka',
      label: 'kafka',
    },
    {
      type: 'doc',
      id: 'reference/connectors/kv',
      label: 'kv',
    },
    {
      type: 'doc',
      id: 'reference/connectors/metrics',
      label: 'metrics',
    },
    {
      type: 'doc',
      id: 'reference/connectors/metronome',
      label: 'metronome',
    },
    {
      type: 'doc',
      id: 'reference/connectors/null',
      label: 'null',
    },
    {
      type: 'doc',
      id: 'reference/connectors/otel',
      label: 'otel',
    },
    {
      type: 'doc',
      id: 'reference/connectors/s3',
      label: 's3',
    },
    {
      type: 'doc',
      id: 'reference/connectors/stdio',
      label: 'stdio',
    },
    {
      type: 'doc',
      id: 'reference/connectors/tcp',
      label: 'tcp',
    },
    {
      type: 'doc',
      id: 'reference/connectors/udp',
      label: 'udp',
    },
    {
      type: 'doc',
      id: 'reference/connectors/unix_socket',
      label: 'unix_socket',
    },
    {
      type: 'doc',
      id: 'reference/connectors/wal',
      label: 'wal',
    },
    {
      type: 'doc',
      id: 'reference/connectors/ws',
      label: 'ws',
    },
  ],
  librarySidebar: [
    {
      type: 'doc',
      id: 'reference/library/overview',
      label: 'Overview',
    },
    {
      'Standard Library': [
        {
          'std': [
            'reference/library/std',
            'reference/library/std/array',
            'reference/library/std/base64',
            'reference/library/std/binary',
            'reference/library/std/float',
            'reference/library/std/integer',
            'reference/library/std/json',
            'reference/library/std/math',
            'reference/library/std/path',
            'reference/library/std/random',
            'reference/library/std/range',
            'reference/library/std/re',
            'reference/library/std/record',
            'reference/library/std/string',
            'reference/library/std/test',
            'reference/library/std/type',
            'reference/library/std/url',
            'reference/library/std/size',
          ]
        },
        {
          'tremor': [
            'reference/library/tremor',
            'reference/library/tremor/chash',
            'reference/library/tremor/origin',
            'reference/library/tremor/system',
          ]
        },
        {
          'cncf': [
            'reference/library/cncf',
            'reference/library/cncf/otel',
            'reference/library/cncf/otel/span_id',
            'reference/library/cncf/otel/trace_id',
            {
              'logs': [
                'reference/library/cncf/otel/logs',
                'reference/library/cncf/otel/logs/severity',
                'reference/library/cncf/otel/logs/traceflags',
              ]
            },
            {
              'metrics': [
                'reference/library/cncf/otel/metrics',
                'reference/library/cncf/otel/metrics/temporality',
              ]
            },
            {
              'trace': [
                'reference/library/cncf/otel/trace',
                'reference/library/cncf/otel/trace/spankind',
                'reference/library/cncf/otel/trace/status',
              ]
            },
          ]
        },
        {
          'aggr': [
            'reference/library/aggr',
            'reference/library/aggr/stats',
            'reference/library/aggr/win',
          ]
        },
      ]
    },
  ],

  languageSidebar: [
    {
      type: 'doc',
      id: 'reference/language',
      label: 'Language Reference',
    },
    {
      'Features': [
        'features',
        {
          'Querying': [
            'queries/overview',
            'queries/operators',
            'queries/walkthrough',
            'queries/recipes',
          ]
        },
        {
          'Scripting': [
            'scripts/overview',
            'scripts/recipes',
          ]
        },
        {
          'Extractors': [
            'extractors/overview',
            'extractors/base64',
            'extractors/cidr',
            'extractors/datetime',
            'extractors/dissect',
            'extractors/glob',
            'extractors/grok',
            'extractors/influx',
            'extractors/json',
            'extractors/kv',
            'extractors/regex',
          ]
        },
        {
          'Functional Programming': [
            'functions/overview',
          ]
        },
      ],
      'Reference': [
        'reference/language/module_system',
        'reference/language/deploy',
        'reference/language/query',
        'reference/language/script',
        'reference/language/full',
        'reference/language/EBNF'
      ],
    },
  ],
  recipesSidebar: [
    {
      type: 'doc',
      id: 'recipes/overview',
      label: 'Recipes',
    },
    {
      "Guides": [
        "guides/basics",
        "guides/metrics"
      ]
    },
    {
      'Messaging': [
        'recipes/kafka_elastic_correlation/index',
        'recipes/redpanda_elastic_correlation/index',
        'recipes/kafka_gd/index',
        'recipes/redpanda_gd/index',
        'recipes/amqp_rabbitmq/index',
      ]
    },
    {
      'Observability': [
        {
          'OpenTelemetry': [
            'recipes/otel_elastic_apm/index',
            'recipes/otel_passthrough/index',
            'recipes/otel_zipkin/index',
            'recipes/otel_jaeger/index',
            'recipes/otel_prometheus/index',
          ]
        },
        {
          'ELK': [
            'recipes/otel_elastic_apm/index',
            'recipes/logstash/index',
          ]
        },
        // { 'Grafana': [
        'recipes/grafana/index',
        // ]},

      ]
    },
    {
      'Design Patterns': [
        'recipes/polling_alerts/index',
        'recipes/quota_service/index',
        'recipes/configurator/index',
      ]
    },
    {
      'Time Series Database': [
        'recipes/influx/index',
        'recipes/postgres_timescaledb/index',
      ]
    },
    {
      'Syslog': [
        'recipes/syslog_udp/index',
        'recipes/syslog_udp_dns/index',
      ]
    },
    {
      'HTTP & WebSockets': [
        'recipes/servers_lt_http/index',
        'recipes/servers_lt_ws/index',
        'recipes/proxies_lt_http/index',
        'recipes/proxies_lt_ws/index',
        'recipes/bridges_lt_http_ws/index',
        'recipes/reverse_proxy_load_balancing/index',
      ]
    },
    {
      'Guaranteed Delivery': [
        'recipes/transient_gd/index',
        'recipes/persistent_gd/index',
      ]
    },
    {
      'Distribution': [
        'recipes/roundrobin/index',
      ]
    },
  ],
};

module.exports = sidebars;
