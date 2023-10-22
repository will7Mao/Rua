import { formatTime } from "../utils/TimeUtils";

import {
    TickleFocusRecord,
    Duration,
    TimeUnit
} from "./Tickle";

export class Pomodoro {
    // 番茄钟的时长 25分钟
    staticCountDown: number = 25 * 60 * 1000;
    pomodoroLogs: PomodoroLog[];
    private logId: number = 1;

    constructor(
    ) {
        this.pomodoroLogs = [];
    }

    currentLog(): PomodoroLog | undefined {
        return this.pomodoroLogs.filter(
            log => log.status == PomodoroLogStatusEnum.STARTED || log.status == PomodoroLogStatusEnum.PAUSED
        )[0];
    }

    addLog(
        desc?: string
    ) {
        // 如果不存在全部log 均为ENDED，才能添加新的log
        if (this.pomodoroLogs.filter(log => log.status != PomodoroLogStatusEnum.ENDED).length == 0) {
            this.pomodoroLogs.push(new PomodoroLog(++this.logId,
                new Date(), PomodoroLogStatusEnum.STARTED, desc));
        }
    }

    finish(id: number): TickleFocusRecord | null {
        if (this.pomodoroLogs.length == 0) {
            return null
        }
        // 获取pomodoroLogs中开始时间最早的log
        const minIdRecord = this.pomodoroLogs.reduce((minLog, currentLog) => {
            if (minLog.id < currentLog.id) {
                return minLog;
            } else {
                return currentLog;
            }
        });


        const maxIdRecord = this.pomodoroLogs.reduce((maxLog, currentLog) => {
            if (maxLog.id < currentLog.id) {
                return currentLog;
            } else {
                return maxLog;
            }
        });

        if (maxIdRecord.status != PomodoroLogStatusEnum.ENDED) {
            maxIdRecord.finish()
        }

        return new TickleFocusRecord(
            ++id,
            minIdRecord.startTime,
            maxIdRecord.endTime?.getTime()!! - minIdRecord.startTime.getTime(),
        )
    }

    remainCountDown(): number {
        return this.currentLog() == undefined ? this.staticCountDown :
            new Date().getTime() - this.currentLog()!!.startTime.getTime()
    }

    remainCountDownDisplay(): string {
        let remainCountDown = this.remainCountDown()
        const minutes = Math.floor(remainCountDown / 1000 / 60);
        const seconds = Math.floor(remainCountDown / 1000 % 60);
        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        return formattedTime
    }

    // 返回此次番茄钟focus总和
    countFocusTime(): Duration {
        let duration = 0;
        this.pomodoroLogs.forEach(pomodoroLog => {
            if (pomodoroLog.status == PomodoroLogStatusEnum.ENDED) {
                duration += pomodoroLog.getDuration()
            }
        });

        if (duration > 60) {
            return new Duration(duration / 60, TimeUnit.h);
        }
        return new Duration(duration, TimeUnit.min);
    }

    countFocusTimeDisplay(): string {
        let duration = this.countFocusTime()
        console.log(`${duration.value}${(duration.unit == TimeUnit.min ? 'min' : 'h')}`)
        return `${duration.value}${(duration.unit == TimeUnit.min ? 'min' : 'h')}`
    }

    countDownProgress(): number {
        if (this.currentLog() == undefined) {
            return 100
        }
        var result = (this.remainCountDown() / this.staticCountDown) * 100;
        var roundedResult = result.toFixed(2);
        return parseFloat(roundedResult)
    }
}

export class PomodoroLog {
    id: number;
    startTime: Date;
    endTime?: Date;
    status: number;
    description?: string;

    constructor(
        id: number,
        startTime: Date,
        status: PomodoroLogStatusEnum,
        description?: string,
        endTime?: Date,
    ) {
        this.id = id;
        this.startTime = startTime;
        this.status = status;
        this.endTime = endTime
        this.description = description
    }

    finish() {
        this.status = PomodoroLogStatusEnum.ENDED;
        this.endTime = new Date();
    }

    // 返回毫秒值
    getDuration(): number {
        return this.endTime?.getTime() ? 0 : this.endTime?.getTime()!! - this.startTime.getTime();
    }

    getDurationDisplay(): string {
        const startTimeStr = formatTime(this.startTime);
        const endTimeStr = this.endTime ? formatTime(this.endTime) : ' - ';
        const displayTimeStr = `start: ${startTimeStr} end: ${endTimeStr}`;
        return displayTimeStr
    }

    getTimelineNodeColor(): string {
        return this.status == 1 ? '#67c23a' : '#909399'
    }
}

export enum PomodoroLogStatusEnum {
    STARTED = 1,
    ENDED = 2,
}