﻿using Quartz;
using Quartz.Impl;
using System;

namespace ScheduledTaskExample.ScheduledTasks
{
    public class JobScheduler
    {
        public static void Start()
        {
            IScheduler scheduler = StdSchedulerFactory.GetDefaultScheduler();
            scheduler.Start();

            IJobDetail job = JobBuilder.Create<EmailJob>().Build();

            ITrigger trigger = TriggerBuilder.Create()
            .WithDailyTimeIntervalSchedule
            (s =>
            s.WithIntervalInHours(9)
            .OnEveryDay()
             //StartingDailyAt(TimeOfDay.HourAndMinuteOfDay(0, 0))
            )
            .Build();

            scheduler.ScheduleJob(job, trigger);
        }
    }
}
