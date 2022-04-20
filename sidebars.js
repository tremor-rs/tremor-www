// @ts-check
/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  gettingStartedSidebar: [
    { 
      type: 'doc',
      id: 'getting-started/overview',
      label: 'Getting Started',
    },
    { 'Getting Started': [
      { id: 'getting-started/install', label: 'Install' },
      'getting-started/connectivity',
      'getting-started/tooling',
      'getting-started/codecs',
      'getting-started/scripting',
      'getting-started/specialize',
    ]},
  ],
  communitySidebar: [
    {
      type: 'doc',
      id: 'community/overview',
      label: 'Community',
    },
    { 'Governance': [
        'community/governance/overview',
        'community/governance/CodeofConduct',
        'community/governance/CII',
        'community/governance/Versioning',
        'community/governance/policies/security',
    ]},
    { 'Development': [
        'community/development/overview',
        'community/development/quick-start',
        'community/development/testing',
        'community/development/debugging',
        'community/development/profiling',
        'community/development/benchmarking',
    ]},
    'community/teams',
    { 'EventsAndMedia': [
      'community/events/overview',
      'community/events/TremorCon2021',
    ]},
    'community/faqs',
    'community/case-studies',
  ],

  gettingStartedSidebar: [
    {
      type: 'doc',
      id: 'getting-started/overview',
      label: 'Getting Started',
    },
    'getting-started/about',
    'getting-started/install',
    'getting-started/connectivity',
    'getting-started/tooling',
    'getting-started/codecs',
    'getting-started/scripting',
    'getting-started/specialize'
  ],
  
  connectorsSidebar: [
    {
      type: 'doc',
      id: 'connectors',
      label: 'Connectors Reference',
    },
        { 'Codecs': [ 
            'connectors/codecs',
            'connectors/codecs/json',
            'connectors/codecs/yaml',
            'connectors/codecs/csv',
            'connectors/codecs/msgpack',
            'connectors/codecs/string',
            'connectors/codecs/influx',
            'connectors/codecs/binflux',
            'connectors/codecs/statsd',
            'connectors/codecs/syslog',
        ]},
        { 'Preprocessors': [
	  'connectors/preprocessors',
	  'connectors/preprocessors/base64',
	  'connectors/preprocessors/decompress',
	  'connectors/preprocessors/gelf',
	  'connectors/preprocessors/length-prefix',
	  'connectors/preprocessors/lines',
	  'connectors/preprocessors/remove-empty',
        ]},
        { 'Postprocessors': [
          'connectors/postprocessors',
          'connectors/postprocessors/base64',
          'connectors/postprocessors/compress',
          'connectors/postprocessors/gelf',
          'connectors/postprocessors/ingest-timestamp',
          'connectors/postprocessors/length-prefix',
          'connectors/postprocessors/lines',
        ]},
        { 'Supported Connectors': [
          'connectors/file',
          'connectors/metrics',
          'connectors/stdio',
          'connectors/tcp',
          'connectors/udp',
          'connectors/kv',
          'connectors/metronome',
          'connectors/crononome',
          'connectors/wal',
          'connectors/dns',
          'connectors/discord',
          'connectors/ws',
          'connectors/elastic',
          'connectors/s3',
          'connectors/kafka',
          'connectors/unix_socket',
          'connectors/otel',
        ]},
        { 'Development Connectors': [
          'connectors/cb',
          'connectors/bench',
          'connectors/null',
        ]},
  ],
  librarySidebar: [
    {
      type: 'doc',
      id: 'library/overview',
      label: 'Overview',
    },
    {'Standard Library': [ 
      { 'std': [ 
        'library/std',
        'library/std/array',
        'library/std/base64',
        'library/std/binary',
        'library/std/float',
        'library/std/integer',
        'library/std/json',
        'library/std/math',
        'library/std/path',
        'library/std/random',
        'library/std/range',
        'library/std/re',
        'library/std/record',
        'library/std/string',
        'library/std/test',
        'library/std/type',
        'library/std/url',
        'library/std/size',
      ]},
      { 'tremor': [
        'library/tremor',
        'library/tremor/chash',
        'library/tremor/origin',
        'library/tremor/system',
      ]},
      { 'cncf': [ 
        'library/cncf',
        'library/cncf/otel',
        'library/cncf/otel/span_id',
        'library/cncf/otel/trace_id',
        { 'logs': [ 
          'library/cncf/otel/logs' ,
          'library/cncf/otel/logs/severity',	
          'library/cncf/otel/logs/traceflags', 
        ]},
        { 'metrics': [ 
          'library/cncf/otel/metrics',
          'library/cncf/otel/metrics/temporality',
        ]},
        { 'trace': [
          'library/cncf/otel/trace',
          'library/cncf/otel/trace/spankind',
          'library/cncf/otel/trace/status',
        ]},
      ]},
      { 'aggr': [ 
        'library/aggr',
        'library/aggr/stats',
        'library/aggr/win',
      ]},
]},
  ],

  languageSidebar: [
   {
      type: 'doc',
      id: 'language',
      label: 'Language Reference',
   },
   {
      'Features': [ 
        'features', 
        {'Querying': [
          'queries/overview',
          'queries/operators',
          'queries/walkthrough',
          'queries/recipes',
        ]},
        {'Scripting': [
          'scripts/overview',
          'scripts/recipes',
        ]},
        {'Extractors': [
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
        ]},
        {'Functional Programming': [
          'functions/overview',
        ]},
      ],
      'Reference': [ 
        'language/module_system', 
        'language/deploy', 
        'language/query', 
        'language/script', 
        'language/full', 
        'language/EBNF'
      ],
   },
  ],
  recipesSidebar: [
    {
      type: 'doc',
      id: 'recipes/overview',
      label: 'Recipes',
    },
    { 'Basic': [
      'recipes/passthrough/index',
      'recipes/filter/index',
      'recipes/transform/index',
      'recipes/validate/index',
    ]},
    { 'Messaging': [
      'recipes/kafka_elastic_correlation/index',
      'recipes/redpanda_elastic_correlation/index',  
      'recipes/kafka_gd/index',
      'recipes/redpanda_gd/index',
      'recipes/amqp_rabbitmq/index',
    ]},
    { 'Observability': [
      { 'OpenTelemetry': [
        'recipes/otel_elastic_apm/index',
        'recipes/otel_passthrough/index',
        'recipes/otel_zipkin/index',
        'recipes/otel_jaeger/index',
        'recipes/otel_prometheus/index',
      ]},
      { 'ELK': [
        'recipes/otel_elastic_apm/index',
        'recipes/logstash/index',
      ]},
      // { 'Grafana': [
        'recipes/grafana/index',
      // ]},

    ]},
    { 'Design Patterns': [
      'recipes/polling_alerts/index',
      'recipes/quota_service/index',
      'recipes/configurator/index',  
    ]},
    { 'Time Series Database': [
      'recipes/influx/index',
      'recipes/postgres_timescaledb/index',
    ]},
    { 'Syslog': [
      'recipes/syslog_udp/index',
      'recipes/syslog_udp_dns/index',
    ]},
    { 'HTTP & WebSockets': [
      'recipes/servers_lt_http/index',
      'recipes/servers_lt_ws/index',
      'recipes/proxies_lt_http/index',
      'recipes/proxies_lt_ws/index',
      'recipes/bridges_lt_http_ws/index',
      'recipes/reverse_proxy_load_balancing/index',
    ]},
    { 'Guaranteed Delivery': [
      'recipes/transient_gd/index',
      'recipes/persistent_gd/index',
    ]},
    { 'Distribution': [
      'recipes/roundrobin/index',
    ]},
  ],
};

module.exports = sidebars;
