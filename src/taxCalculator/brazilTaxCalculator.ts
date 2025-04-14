function round(value: number) {
  return Math.ceil(value * 100) / 100;
}

export class BrazilTaxCalculator {
  discountedDutyRate = 0.2;
  discountedDutyRateBreakpoint = 50;
  defaultDutyRate = 0.6;
  possibleDutyRateDiscount = 20;
  icmsRate = 0.17;

  getDutyRate(value: number, isRemessaConforme: boolean) {
    return value <= this.discountedDutyRateBreakpoint && isRemessaConforme
      ? this.discountedDutyRate
      : this.defaultDutyRate;
  }

  getDutyRateDiscount(value: number, isRemessaConforme: boolean) {
    return value > this.discountedDutyRateBreakpoint && isRemessaConforme
      ? this.possibleDutyRateDiscount
      : 0;
  }

  getDuty(value: number, isRemessaConforme: boolean) {
    const dutyRate = this.getDutyRate(value, isRemessaConforme);
    const dutyRateDiscount = this.getDutyRateDiscount(value, isRemessaConforme);
    const duty = round(value * dutyRate - dutyRateDiscount);

    return duty;
  }

  getIcms(value: number) {
    return round((value / (1 - this.icmsRate)) * this.icmsRate);
  }

  get(value: number, isRemessaConforme: boolean) {
    const duty = this.getDuty(value, isRemessaConforme);
    const icms = this.getIcms(value + duty);
    const total = value + duty + icms;

    return {
      duty,
      icms,
      total,
    };
  }
}
