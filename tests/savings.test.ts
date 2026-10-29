import test from "node:test";
import assert from "node:assert/strict";
import { calculateSavings } from "../src/lib/savings";
import { validateOpening } from "../src/lib/onboarding";
test("una tasa efectiva anual del 10% produce 10% en 12 meses sin aportes", () => {
  const result = calculateSavings({initial: 1000000, monthly: 0, months: 12, annualRate: 10});
  assert.ok(Math.abs(result.balance - 1100000) < 0.01);
});
test("con tasa cero se suman todos los aportes sin intereses", () => {
  const result = calculateSavings({initial: 100, monthly: 50, months: 12, annualRate: 0});
  assert.equal(result.balance, 700); assert.equal(result.interest, 0);
});
test("un aporte al final del mes no genera intereses ese mes", () => {
  const result = calculateSavings({initial: 0, monthly: 100, months: 1, annualRate: 12});
  assert.equal(result.balance, 100);
});
test("rechaza montos negativos, números no finitos y meses fraccionarios", () => {
  for (const invalid of [{initial:-1}, {months:1.5}, {monthly:NaN}, {months:0}, {months:601}, {annualRate:Infinity}]) {
    assert.throws(() => calculateSavings({initial:100, monthly:10, months:12, annualRate:10, ...invalid}));
  }
});
const valid = {name:"Ana Torres", document:"123456789", email:"ana@example.com", recaptcha:"OK"};
test("el formulario válido no tiene errores", () => assert.deepEqual(validateOpening(valid), {}));
test("rechaza recaptcha ausente o diferente de OK", () => {
  for (const recaptcha of ["", "ok", "NO"]) assert.ok(validateOpening({...valid, recaptcha}).recaptcha);
});
test("valida nombre, documento y correo", () => {
  const errors = validateOpening({name:"A", document:"abc123", email:"invalido", recaptcha:"OK"});
  assert.ok(errors.name); assert.ok(errors.document); assert.ok(errors.email);
});
