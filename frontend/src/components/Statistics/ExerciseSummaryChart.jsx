import React, { useMemo, useState, useEffect } from "react";
import { Card, Select, Divider, theme as antdTheme, Button, Spin } from "antd";
import ReactECharts from "echarts-for-react";
import dayjs from "dayjs";
import { IoShareSocialOutline } from "react-icons/io5";
import { getMyWorkouts } from "../../services/api";

const enumerateDates = (startStr, endStr) => {
  const out = [];
  let d = dayjs(startStr), end = dayjs(endStr);
  while (d.isSame(end) || d.isBefore(end)) { 
    out.push(d.format("YYYY-MM-DD")); 
    d = d.add(1, "day"); 
  }
  return out;
};

const labelMap = {
  squat: "Przysiady",
  "jumping-jacks": "Pajace",
  "side-lunges": "Wykroki w bok",
  "side-bends": "Skłony w bok",
};

const colorMap = {
  squat: "#5B8FF9",
  "jumping-jacks": "#5AD8A6",
  "side-lunges": "#F6BD16",
  "side-bends": "#E86452",
};

const calculateDaysBack = (preset) => {
  switch (preset) {
    case "7": return 7;
    case "30": return 30;
    case "90": return 90;
    case "180": return 180;
    case "365": return 365;
    case null:
    case "all":
      return null;
    default:
      return 30;
  }
};

export default function ExerciseSummaryChart({ onShare }) {
  const { token } = antdTheme.useToken();
  const chartRef = React.useRef(null);

  const [dataset, setDataset] = useState([]);
  const [datePreset, setDatePreset] = useState("7");
  const [selectedTypes, setSelectedTypes] = useState([]);
  
  const [loading, setLoading] = useState(false);

  const allTypes = useMemo(
    () => Array.from(new Set(dataset.map(d => d.exerciseType))),
    [dataset]
  );

  useEffect(() => {
    setSelectedTypes(allTypes);
  }, [allTypes]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      setLoading(true);
      try {
        const days = calculateDaysBack(datePreset);
        const data = await getMyWorkouts(days);

        const mapped = data.map(w => ({
          data: dayjs(w.date).format("YYYY-MM-DD"),
          exerciseType: w.exerciseType,
          counter: w.counter,
          time: w.time
        }));

        setDataset(mapped);
      } catch (err) {
        console.error("Error fetching workouts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [datePreset]);

  const minDateStr = useMemo(
    () => (dataset.length ? dataset.map(r => r.data).sort()[0] : dayjs().format("YYYY-MM-DD")),
    [dataset]
  );

  const maxDateStr = useMemo(
    () => (dataset.length ? dataset.map(r => r.data).sort().slice(-1)[0] : dayjs().format("YYYY-MM-DD")),
    [dataset]
  );

  const days = useMemo(() => enumerateDates(minDateStr, maxDateStr), [minDateStr, maxDateStr]);

  const series = useMemo(() => {
    const idx = new Map();
    for (const r of dataset) {
      idx.set(`${r.data}|${r.exerciseType}`, r);
    }

    return selectedTypes.map((type) => {
      const name = labelMap[type] || type;
      const data = days.map((d) => idx.get(`${d}|${type}`)?.counter ?? 0);
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
  }, [selectedTypes, days, dataset]);

  const handleShare = () => {
    const echartsInstance = chartRef.current.getEchartsInstance();
    const img = echartsInstance.getDataURL({
      type: "png",
      pixelRatio: 2,
      backgroundColor: "#fff"
    });

    onShare?.(img);
  };

  const colors = useMemo(
    () =>
      series.map(s => {
        const backendKey = Object.keys(labelMap).find(key => labelMap[key] === s.name);
        return colorMap[backendKey] ?? token.colorPrimary;
      }),
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
    },
    legend: { bottom: 0, textStyle: { color: token.colorText }},
    grid: { left: 8, right: 12, top: 24, bottom: 40, containLabel: true },
    xAxis: { type: "category", data: days },
    yAxis: { type: "value" },
    series,
  }), [colors, days, series, token]);

  const presets = [
    { value: "7", label: "Ostatnie 7 dni" },
    { value: "30", label: "Ostatnie 30 dni" },
    { value: "90", label: "Ostatnie 3 msc" },
    { value: "180", label: "Ostatnie 6 msc" },
    { value: "365", label: "Ostatni rok" },
    { value: null, label: "Wszystko" },
  ];
  
  if (loading) return (
    <div>
      <Spin size="large" />
    </div>
  );

  if (dataset.length==0) 
  return (
    <Card style={{ 
      display: "flex", 
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      height: "100%" 
    }}>
      Brak danych. <br />
      Wykonaj ćwiczenia by zobaczyć statystyki.
    </Card>
  );

  return (
    <Card
      title={
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 16 }}>Podsumowanie ćwiczeń</span>
            <Button onClick={handleShare} icon={<IoShareSocialOutline />}>Udostępnij</Button>
            <Select value={datePreset} onChange={setDatePreset} options={presets} style={{ minWidth: 200 }} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 16 }}>Rodzaj ćwiczeń</span>
            <Select
              mode="multiple"
              style={{ minWidth: 220, width: "100%" }}
              value={selectedTypes}
              onChange={setSelectedTypes}
              options={allTypes.map((t) => ({ label: labelMap[t] || t, value: t }))}
              placeholder="Wybierz ćwiczenia"
              maxTagCount="responsive"
            />
          </div>
        </div>
      }
    >
      <ReactECharts ref={chartRef} option={option} style={{ height: 320, width: "100%" }} opts={{ renderer: "svg" }} />
      <Divider style={{ margin: "8px 0 0" }} />
    </Card>
  );
}
