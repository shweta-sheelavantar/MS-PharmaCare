package com.auth.dto.admin;


public class AnalyticsResponse {
    private String metricName;
    private Object metricValue;

    public AnalyticsResponse() {}

    public AnalyticsResponse(String metricName, Object metricValue) {
        this.metricName = metricName;
        this.metricValue = metricValue;
    }

    public String getMetricName() {
        return metricName;
    }

    public void setMetricName(String metricName) {
        this.metricName = metricName;
    }

    public Object getMetricValue() {
        return metricValue;
    }

    public void setMetricValue(Object metricValue) {
        this.metricValue = metricValue;
    }
}
