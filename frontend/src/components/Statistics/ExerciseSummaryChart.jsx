import React, { useMemo, useState } from "react";
import { Card, Select, Divider, theme as antdTheme } from "antd";
import ReactECharts from "echarts-for-react";
import dayjs from "dayjs";

const daysAgo = (n) => dayjs().subtract(n, "day").format("YYYY-MM-DD");
const enumerateDates = (startStr, endStr) => {
  const out = [];
  let d = dayjs(startStr), end = dayjs(endStr);
  while (d.isSame(end) || d.isBefore(end)) { out.push(d.format("YYYY-MM-DD")); d = d.add(1, "day"); }
  return out;
};

const dataset = [
  { data: daysAgo(7), exerciseType: "jumpingJacks", counter: 6, time: 540 },
  { data: daysAgo(7), exerciseType: "sideLunges",   counter: 2, time: 90 },
  { data: daysAgo(6), exerciseType: "sideLunges",   counter: 4, time: 260 },
  { data: daysAgo(6), exerciseType: "jumpingJacks", counter: 5, time: 480 },
  { data: daysAgo(5), exerciseType: "squat",        counter: 3, time: 75 },
  { data: daysAgo(4), exerciseType: "jumpingJacks", counter: 7, time: 720 },
  { data: daysAgo(3), exerciseType: "sideLunges",   counter: 5, time: 300 },
  { data: daysAgo(3), exerciseType: "squat",        counter: 1, time: 30 },
  { data: daysAgo(2), exerciseType: "squat",        counter: 8, time: 1500 },
  { data: daysAgo(2), exerciseType: "sideLunges",   counter: 3, time: 180 },
  { data: daysAgo(1), exerciseType: "squat",        counter: 2, time: 600 },
  { data: daysAgo(1), exerciseType: "jumpingJacks", counter: 4, time: 420 },
];

const labelMap = {
  squat: "Przysiady",
  jumpingJacks: "Pajace",
  sideLunges: "Wykroki",
};
const allTypes = Array.from(new Set(dataset.map(d => d.exerciseType)));
const colorMap = {
  Przysiady: "#5B8FF9",
  Pajace:    "#5AD8A6",
  Wykroki:   "#F6BD16",
};

export default function ExerciseSummaryChart() {
  const { token } = antdTheme.useToken();

  const minDateStr = useMemo(
    () => dataset.reduce((min, r) => (r.data < min ? r.data : min), dataset[0].data),
    []
  );
  const maxDateStr = useMemo(
    () => dataset.reduce((max, r) => (r.data > max ? r.data : max), dataset[0].data),
    []
  );

  const presets = [
    { value: "7d",  label: "Ostatnie 7 dni" },
    { value: "30d", label: "Ostatnie 30 dni" },
    { value: "3m",  label: "Ostatnie 3 msc" },
    { value: "6m",  label: "Ostatnie 6 msc" },
    { value: "1y",  label: "Ostatni rok" },
    { value: "all", label: "Wszystko" },
  ];

  const [datePreset, setDatePreset] = useState("7d");
  const [selectedTypes, setSelectedTypes] = useState(allTypes);

  const { startStr, endStr } = useMemo(() => {
    const end = dayjs(maxDateStr);
    let start;
    switch (datePreset) {
      case "7d":  start = end.subtract(6, "day"); break;
      case "30d": start = end.subtract(29, "day"); break;
      case "3m":  start = end.subtract(3, "month").add(1, "day"); break;
      case "6m":  start = end.subtract(6, "month").add(1, "day"); break;
      case "1y":  start = end.subtract(1, "year").add(1, "day"); break;
      case "all":
      default:    start = dayjs(minDateStr); break;
    }
    if (start.isBefore(dayjs(minDateStr))) start = dayjs(minDateStr);
    return { startStr: start.format("YYYY-MM-DD"), endStr: end.format("YYYY-MM-DD") };
  }, [datePreset, minDateStr, maxDateStr]);

  const days = useMemo(() => enumerateDates(startStr, endStr), [startStr, endStr]);
  const series = useMemo(() => {
    const idx = new Map();
    for (const r of dataset) {
      if (r.data >= startStr && r.data <= endStr) idx.set(`${r.data}|${r.exerciseType}`, r);
    }
    return selectedTypes.map((type) => {
      const name = labelMap[type] || type;
      const data = days.map((d) => (idx.get(`${d}|${type}`)?.counter ?? 0));
      return {
        name,
        type: "line",
        smooth: true,
        showSymbol: true,
        symbolSize: 6,
        data,
        lineStyle: { width: 3 },
      };
    });
  }, [selectedTypes, days, startStr, endStr]);

  const colors = useMemo(
    () => series.map(s => colorMap[s.name] ?? token.colorPrimary),
    [series, token.colorPrimary]
  );

  const option = useMemo(() => ({
    backgroundColor: "transparent",
    color: colors,
    tooltip: {
      trigger: "axis",
      backgroundColor: token.colorBgElevated,
      borderColor: token.colorBorder,
      textStyle: { color: token.colorText },
      formatter: (params) => {
        const day = days[params?.[0]?.dataIndex ?? 0] || "";
        const lines = params.map(p => {
          const label = p.seriesName;
          const value = p.value;
          return `<div style="display:flex;gap:8px;align-items:center;">
                    <span style="display:inline-block;width:10px;height:10px;background:${p.color};border-radius:50%;"></span>
                    <span>${label}: <b>${value}</b> powt.</span>
                  </div>`;
        });
        return `<div><div style="margin-bottom:6px;"><b>${day}</b></div>${lines.join("")}</div>`;
      },
    },
    legend: {
      bottom: 0,
      textStyle: { color: token.colorText },
    },
    grid: { left: 8, right: 12, top: 24, bottom: 40, containLabel: true },
    xAxis: {
      type: "category",
      data: days,
      axisLine: { lineStyle: { color: token.colorBorderSecondary } },
      axisTick: { lineStyle: { color: token.colorBorderSecondary } },
      axisLabel: { color: token.colorTextSecondary },
      splitLine: { show: false },
    },
    yAxis: {
      type: "value",
      axisLine: { lineStyle: { color: token.colorBorderSecondary } },
      axisTick: { lineStyle: { color: token.colorBorderSecondary } },
      axisLabel: { color: token.colorTextSecondary },
      splitLine: { lineStyle: { color: token.colorSplit } },
    },
    series,
  }), [colors, days, series, token]);

  return (
    <Card
      title={
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
              minHeight: "100%"
            }}
          >
            <span style={{ fontWeight: 600, fontSize: 16 }}>Podsumowanie ćwiczeń</span>
            <Select
              value={datePreset}
              onChange={setDatePreset}
              options={presets}
              style={{ minWidth: 200 }}
            />
          </div>
    
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontWeight: 600, fontSize: 16 }}>Rodzaj ćwiczeń</span>
            <Select
              mode="multiple"
              style={{ minWidth: 220, width: "100%" }}
              value={selectedTypes}
              onChange={setSelectedTypes}
              options={allTypes.map((t) => ({
                label: labelMap[t] || t,
                value: t,
              }))}
              placeholder="Wybierz ćwiczenia"
              maxTagCount="responsive"
            />
          </div>
        </div>
      }
      styles={{ body: { paddingTop: 16 } }}
    >
      <ReactECharts
        option={option}
        style={{ height: 320, width: "100%" }}
        opts={{ renderer: "svg" }}
      />
      <Divider style={{ margin: "8px 0 0" }} />
    </Card>
  );
}
