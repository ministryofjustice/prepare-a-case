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

  - name: APPINSIGHTS_INSTRUMENTATIONKEY
    valueFrom:
      secretKeyRef:
        name: prepare-a-case
        key: APPINSIGHTS_INSTRUMENTATIONKEY

  - name: SESSION_SECRET
    valueFrom:
      secretKeyRef:
        name: prepare-a-case
        key: SESSION_SECRET

  - name: GOOGLE_ANALYTICS_KEY
    valueFrom:
      secretKeyRef:
        name: prepare-a-case
        key: GOOGLE_ANALYTICS_KEY

  - name: NOTIFICATION_USERNAME
    valueFrom:
      secretKeyRef:
        name: prepare-a-case
        key: NOTIFICATION_USERNAME

  - name: NOTIFICATION_PASSWORD
    valueFrom:
      secretKeyRef:
        name: prepare-a-case
        key: NOTIFICATION_PASSWORD

  - name: NOMIS_AUTH_URL
    value: {{ .Values.env.NOMIS_AUTH_URL | quote }}

  - name: INGRESS_URL
    value: 'https://{{ .Values.ingress.host }}'

  - name: SERVER_PORT
    value: {{ .Values.image.port | quote }}

  - name: COURT_CASE_SERVICE_URL
    value: {{ .Values.env.COURT_CASE_SERVICE_URL | quote }}

  - name: CASES_PER_PAGE
    value: {{ .Values.env.CASES_PER_PAGE | quote }}

  - name: REDIS_HOST
    valueFrom:
      secretKeyRef:
        name: pac-elasticache-redis
        key: primary_endpoint_address

  - name: REDIS_AUTH_TOKEN
    valueFrom:
      secretKeyRef:
        name: pac-elasticache-redis
        key: auth_token

  - name: REDIS_TLS_ENABLED
    value: {{ .Values.env.REDIS_TLS_ENABLED }}
    value: "true"

  - name: CASE_SNAPSHOT_TIMES
    value: {{ .Values.env.CASE_SNAPSHOT_TIMES | quote }}

  - name: USER_PREFERENCE_SERVICE_URL
    value: {{ .Values.env.USER_PREFERENCE_SERVICE_URL | quote }}

  - name: ENABLE_PAST_CASES_NAVIGATION
    value: {{ .Values.env.ENABLE_PAST_CASES_NAVIGATION | quote }}

  - name: ENABLE_CASE_COMMENTS
    value: {{ .Values.env.ENABLE_CASE_COMMENTS | quote }}

  - name: ENABLE_CASE_PROGRESS
    value: {{ .Values.env.ENABLE_CASE_PROGRESS | quote }}

  - name: PAC_ENV
    value: {{ .Values.env.PAC_ENV | quote }}

  - name: CASE_TRACKING_PRE_PILOT_USERS
    value: {{ .Values.env.CASE_TRACKING_PRE_PILOT_USERS | quote }}

{{- end -}}
