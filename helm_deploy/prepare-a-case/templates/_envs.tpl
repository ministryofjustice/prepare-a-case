{{/* vim: set filetype=mustache: */}}
{{/*
Environment variables for web and worker containers
*/}}
{{- define "deployment.envs" }}
env:
  - name: SERVER_PORT
    value: "{{ .Values.image.port }}"
  - name: COURT_CASE_SERVICE_URL
    value: {{ .Values.env.COURT_CASE_SERVICE_URL | quote }}
{{- end -}}