import { expect } from 'chai';
import Chance from 'chance';
import { Query } from "../src/query";
import {Model} from "../src/model";

const chance = new Chance();

class TestModel extends Model { static get tableName() { return 'TestModel'; } }

describe('Query', () => {
    let query;

    beforeEach(() => {
        query = new Query(TestModel);
    });

    it('should set the model type', () => {
        expect(query.modelType).to.have.property('tableName', 'TestModel');
    });

    describe('lambda syntax', () => {
        let result;

        beforeEach(() => {
            result = query.where((x) => x.something === 1);
        });

        it('should parse correctly', () => {
            expect(result.whereClause.columnName).to.equal('something');
            expect(result.whereClause.operator).to.equal('===');
            expect(result.whereClause.testValue).to.equal(1);
        });
    });

    describe('function syntax', () => {
        let result;

        beforeEach(() => {
            result = query.where(function(x) { return x.anything === 'something'; });
        });

        it('should parse correctly', () => {
            expect(result.whereClause.columnName).to.equal('anything');
            expect(result.whereClause.operator).to.equal('===');
            expect(result.whereClause.testValue).to.equal('something');
        });
    });

    describe('when test value is a variable', () => {
        let result,
            testValue;

        beforeEach(() => {
            testValue = chance.natural();

            result = query.where((x) => x.something === testValue, { testValue });
        });

        it('should parse correctly', () => {
            expect(result.whereClause.columnName).to.equal('something');
            expect(result.whereClause.operator).to.equal('===');
            expect(result.whereClause.testValue).to.equal(testValue);
        });
    });

    describe('select', () => {
        let result;

        describe('with one field selected', () => {
            beforeEach(() => {
                result = query.select((x) => x.field);
            });

            it('should return the correct column name', () => {
                expect(result.fieldNames).to.have.lengthOf(1);
                expect(result.fieldNames[0]).to.equal('field');
            });
        });

        describe('with multiple fields selected', () => {
            let titleText;

            beforeEach(() => {
                titleText = chance.word();

                result = query.select((x) => ({
                    id: x.id,
                    field1: x.field1,
                    title: x.title
                }));
            });

            it('should return an array of column names', () => {
                expect(result.fieldNames).to.have.lengthOf(3);
                expect(result.fieldNames[0]).to.equal('id');
                expect(result.fieldNames[1]).to.equal('field1');
                expect(result.fieldNames[2]).to.equal('title');
            });
        });
    });
});