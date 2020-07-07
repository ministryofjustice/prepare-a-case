{{/* vim: set filetype=mustache: */}}
{{/*
Environment variables for web and worker containers
*/}}
{{- define "deployment.envs" }}
env:
  - name: API_CLIENT_ID
    valueFrom:
      secretKeyRef:
        name: {{ template "app.name" . }}
        key: API_CLIENT_ID

  - name: API_CLIENT_SECRET
    valueFrom:
      secretKeyRef:
        name: {{ template "app.name" . }}
        key: API_CLIENT_SECRET

  - name: SESSION_SECRET
    valueFrom:
      secretKeyRef:
        name: {{ template "app.name" . }}
        key: SESSION_SECRET

  - name: NOMIS_AUTH_URL
    value: {{ .Values.env.NOMIS_AUTH_URL | quote }}

  - name: INGRESS_URL
    value: 'https://{{ .Values.ingress.host }}'

  - name: EXIT_LOCATION_URL
    value: {{ .Values.env.EXIT_LOCATION_URL | quote }}

  - name: SERVICE_ENDPOINT_URL
    value: {{ .Values.env.SERVICE_ENDPOINT_URL | quote }}

  - name: SERVER_PORT
    value: {{ .Values.image.port | quote }}

  - name: COURT_CASE_SERVICE_URL
    value: {{ .Values.env.COURT_CASE_SERVICE_URL | quote }}

  - name: CASES_PER_PAGE
    value: {{ .Values.env.CASES_PER_PAGE | quote }}
{{- end -}}
