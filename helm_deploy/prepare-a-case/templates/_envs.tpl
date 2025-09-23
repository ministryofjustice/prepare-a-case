{{/* vim: set filetype=mustache: */}}
{{/*
Environment variables for web and worker containers
*/}}
{{- define "deployment.envs" }}
env:
  - name: API_CLIENT_ID
    valueFrom:
      secretKeyRef:
        name: prepare-a-case
        key: API_CLIENT_ID

  - name: API_CLIENT_SECRET
    valueFrom:
      secretKeyRef:
        name: prepare-a-case
        key: API_CLIENT_SECRET

  - name: APPLICATIONINSIGHTS_CONNECTION_STRING
    valueFrom:
      secretKeyRef:
        name: applicationinsights-connection-string
        key: applicationinsights_connection_string

  - name: CASES_PER_PAGE
    value: {{ .Values.env.CASES_PER_PAGE | quote }}

  - name: CASE_SNAPSHOT_TIMES
    value: {{ .Values.env.CASE_SNAPSHOT_TIMES | quote }}

  - name: CASE_TRACKING_PRE_PILOT_USERS
    value: {{ .Values.env.CASE_TRACKING_PRE_PILOT_USERS | quote }}

  - name: CASE_TRACKING_PRE_PILOT_USERS
    valueFrom:
      secretKeyRef:
        name: case-tracking-pre-pilot-users
        key: case_tracking_pre_pilot_users

  - name: COURT_CASE_SERVICE_URL
    value: {{ .Values.env.COURT_CASE_SERVICE_URL | quote }}

  - name: DEFAULT_TIMEOUT
    value: {{ .Values.env.DEFAULT_TIMEOUT | quote }}

  - name: ENABLE_APP_INSIGHTS
    value: {{ .Values.env.ENABLE_APP_INSIGHTS | quote }}

  - name: ENABLE_CASE_COMMENTS
    value: {{ .Values.env.ENABLE_CASE_COMMENTS | quote }}

  - name: ENABLE_CASE_PROGRESS
    value: {{ .Values.env.ENABLE_CASE_PROGRESS | quote }}

  - name: ENABLE_CLICK_ANALYTICS
    value: {{ .Values.env.ENABLE_CLICK_ANALYTICS | quote }}

  - name: ENABLE_HEARING_OUTCOMES
    value: {{ .Values.env.ENABLE_HEARING_OUTCOMES | quote }}

  - name: ENABLE_MATCHER_LOGGING
    value: {{ .Values.env.ENABLE_MATCHER_LOGGING | quote }}

  - name: ENABLE_MOVE_TO_RESULTED_ACTION
    value: {{ .Values.env.ENABLE_MOVE_TO_RESULTED_ACTION | quote}}

  - name: ENABLE_PAST_CASES_NAVIGATION
    value: {{ .Values.env.ENABLE_PAST_CASES_NAVIGATION | quote }}

  - name: ENABLE_WORKFLOW
    value: {{ .Values.env.ENABLE_WORKFLOW | quote }}

  - name: INGRESS_URL
    value: 'https://{{ .Values.ingress.host }}'

  - name: LIVERPOOL_PRE_PILOT_USERS
    valueFrom:
      secretKeyRef:
        name: liverpool-pre-pilot-users
        key: liverpool_pre_pilot_users

  - name: NOMIS_AUTH_URL
    value: {{ .Values.env.NOMIS_AUTH_URL | quote }}

  - name: NOTIFICATION_PASSWORD
    valueFrom:
      secretKeyRef:
        name: prepare-a-case
        key: NOTIFICATION_PASSWORD

  - name: NOTIFICATION_USERNAME
    valueFrom:
      secretKeyRef:
        name: prepare-a-case
        key: NOTIFICATION_USERNAME

  - name: PAC_ENV
    value: {{ .Values.env.PAC_ENV | quote }}

  - name: REDIS_AUTH_TOKEN
    valueFrom:
      secretKeyRef:
        name: pac-elasticache-redis
        key: auth_token

  - name: REDIS_HOST
    valueFrom:
      secretKeyRef:
        name: pac-elasticache-redis
        key: primary_endpoint_address

  - name: REDIS_TLS_ENABLED
    value: {{ .Values.env.REDIS_TLS_ENABLED }}
    value: "true"

  - name: SERVER_PORT
    value: {{ .Values.image.port | quote }}

  - name: SESSION_SECRET
    valueFrom:
      secretKeyRef:
        name: prepare-a-case
        key: SESSION_SECRET

  - name: USER_PREFERENCE_SERVICE_URL
    value: {{ .Values.env.USER_PREFERENCE_SERVICE_URL | quote }}

  - name: FLIPT_URL
    valueFrom:
      secretKeyRef:
        name: pic-flipt
        key: url

  - name: FLIPT_API_KEY
    valueFrom:
      secretKeyRef:
        name: pic-flipt
        key: api-key

{{- end -}}
