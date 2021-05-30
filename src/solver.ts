import { DipoleConfig } from "./dipole-config";

export class DipoleState {
  constructor(
    public theta: number,
    public omega: number,
    public alpha: number
  ) {}
}

function applyForce(theta: number, config: DipoleConfig): number {
  return 3.3 * config.dipoleMoment * config.electricField * Math.sin(theta);
}

export function verlet(
  current: DipoleState,
  dt: number,
  config: DipoleConfig
): DipoleState {
  const newOmega = current.omega + 0.5 * current.alpha * dt;
  const newTheta = current.theta + newOmega * dt;
  const newAlpha = applyForce(newTheta, config);
  return new DipoleState(newTheta, newOmega, newAlpha);
}
