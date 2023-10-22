export class Tickle {
    id: number;
    title: string;
    description: string;
    deadline?: Date;
    tickleFocusRecords: TickleFocusRecord[];
    color: "";
    status: number;

    constructor(
        id: number,
        title: string,
        description: string,
        tickleFocusRecords: TickleFocusRecord[],
        color: "",
        status: number,
        deadline?: Date,
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.deadline = deadline;
        this.tickleFocusRecords = tickleFocusRecords;
        this.color = color;
        this.status = status;
    }

    countFocusTime(): Duration {
        let duration = 0;
        this.tickleFocusRecords.forEach(record => {
            duration += record.duration / 1000 / 60;
        });

        if (duration > 60) {
            return new Duration(duration / 60, TimeUnit.h);
        }
        return new Duration(duration, TimeUnit.min);
    }
}

export class Duration {
    value: number;
    unit: TimeUnit;

    constructor(value: number, unit: TimeUnit) {
        this.value = value;
        this.unit = unit;
    }

    display(): string {
        return `${this.value}+${this.unit}`
    }
}

export enum TimeUnit {
    min,
    h
}



// 时间为毫秒
export class TickleFocusRecord {
    id: number;
    startTime: Date;
    duration: number;

    constructor(
        id: number,
        startTime: Date,
        duration: number,
    ) {
        this.id = id;
        this.startTime = startTime;
        this.duration = duration;
    }
}