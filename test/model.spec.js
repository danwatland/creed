import { expect } from 'chai';
import Chance from 'chance';
import { Model } from "../src/model";

const chance = new Chance();

describe('Model', () => {

    describe('lambda syntax', () => {
        let result;

        beforeEach(() => {
            let model = new Model();

            result = model.where((x) => x.something === 1);
        });

        it('should parse correctly', () => {
            expect(result.columnName).to.equal('something');
            expect(result.operator).to.equal('===');
            expect(result.testValue).to.equal(1);
        });
    });

    describe('function syntax', () => {
        let result;

        beforeEach(() => {
            let model = new Model();

            result = model.where(function(x) { return x.anything === 'something'; });
        });

        it('should parse correctly', () => {
            expect(result.columnName).to.equal('anything');
            expect(result.operator).to.equal('===');
            expect(result.testValue).to.equal('something');
        });
    });

    describe('when test value is a variable', () => {
        let result,
            testValue;

        beforeEach(() => {
            testValue = chance.natural();
            let model = new Model();

            result = model.where((x) => x.something === testValue, { testValue });
        });

        it('should parse correctly', () => {
            expect(result.columnName).to.equal('something');
            expect(result.operator).to.equal('===');
            expect(result.testValue).to.equal(testValue);
        });
    });

    describe('map', () => {
        let result;

        describe('with one field selected', () => {
            beforeEach(() => {
                let model = new Model();

                result = model.map((x) => x.field);
            });

            it('should return the correct column name', () => {
                expect(result).to.equal('field');
            });
        });

        describe('with multiple fields selected', () => {
            let titleText;

            beforeEach(() => {
                let model = new Model();
                titleText = chance.word();

                result = model.map((x) => ({
                    id: x.id,
                    field1: x.field1,
                    title: x.title
                }));
            });

            it('should return an array of column names', () => {
                expect(result).to.have.lengthOf(3);
                expect(result[0]).to.equal('id');
                expect(result[1]).to.equal('field1');
                expect(result[2]).to.equal('title');
            });
        });
    });
});