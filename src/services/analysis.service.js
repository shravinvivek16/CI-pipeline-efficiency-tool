export function analyzeWorkflowRuns(data) {
    const runs = data.workflow_runs || [];
  
    const totalRuns = runs.length;
  
    let success = 0;
    let failure = 0;
    let totalDuration = 0;
  
    const durations = [];
  
    runs.forEach((run) => {
      if (run.conclusion === "success") success++;
      if (run.conclusion === "failure") failure++;
  
      if (run.run_started_at && run.updated_at) {
        const start = new Date(run.run_started_at);
        const end = new Date(run.updated_at);
  
        const duration = (end - start) / 1000 / 60; // minutes
        totalDuration += duration;
        durations.push({
          id: run.id,
          name: run.name,
          duration: duration.toFixed(2),
        });
      }
    });
  
    const avgDuration = totalRuns > 0
      ? totalDuration / totalRuns
      : 0;
  
    //  find slowest runs
    const slowestRuns = durations
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 3);
  
    let bottleneck = null;
    if (slowestRuns.length > 0) {
      bottleneck = `Slowest job detected: ${slowestRuns[0].name}`;
    }
    const successRate = Number(
      totalRuns ? ((success / totalRuns) * 100).toFixed(2) : 0
    );
    const failureRate = Number(
      totalRuns ? ((failure / totalRuns) * 100).toFixed(2) : 0
    );
    const avgDurationMinutes = Number(avgDuration.toFixed(2));
    let ciHealthScore =
      100 - (100 - successRate) - (failureRate * 2) - avgDurationMinutes;
    ciHealthScore = Math.round(Math.min(100, Math.max(0, ciHealthScore)));
    const avg_duration_minutes = avgDurationMinutes;
    const avgDurationNum = parseFloat(avg_duration_minutes);

    let reduction = 0.2;

    if (bottleneck && bottleneck.toLowerCase().includes("test")) {
      reduction = 0.4;
    } else if (bottleneck && bottleneck.toLowerCase().includes("build")) {
      reduction = 0.3;
    } else if (bottleneck && bottleneck.toLowerCase().includes("deploy")) {
      reduction = 0.25;
    }

    const estimated_new_duration = (avgDurationNum * (1 - reduction)).toFixed(2);
    const time_saved = (avgDurationNum - estimated_new_duration).toFixed(2);
    const weekly_time_saved_hours = ((time_saved * 100 * 5) / 60).toFixed(2);
    const weekly_cost_saved = (weekly_time_saved_hours * 50).toFixed(2);
return {
    total_runs: totalRuns,
    success_rate: successRate,
    failure_rate: failureRate,
    avg_duration_minutes,
    slowest_runs: slowestRuns,
    bottleneck: bottleneck,
    estimated_new_duration,
    time_saved,
    weekly_time_saved_hours,
    weekly_cost_saved,
    ci_health_score: ciHealthScore,
  };
  }
