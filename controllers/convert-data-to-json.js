import pkg from 'lodash';
import HL7 from 'hl7-standard';
import * as fs from 'fs';

import DiagnosticMetrics from '../models/diagnosticMetrics.js';

const { find } = pkg;

const ConvertHL7ToJSON = async (filePath) => {
  try {
    const hl7Data = fs.readFileSync(filePath, 'utf8');
    const hl7 = new HL7(hl7Data);
    hl7.transform(err => {
      if (err) throw err;
    });

    const pidSegments = hl7.getSegments('PID');
    const obxSegments = hl7.getSegments('OBX');
    const results = [];

    for (let i = 0; i < 1; i++) {
      const pidSegment = pidSegments[i];
      const gender = pidSegment.get('PID.8');
      const dateOfBirth = pidSegment.get('PID.7');
      const patientId = pidSegment.get('PID.19');
      const patientName = `${pidSegment.get('PID.5.1')} ${pidSegment.get('PID.5.2')}`;
      for (let j = 0; j < obxSegments.length; j++) {
        const obxSegment = obxSegments[j];
        const oruCode = obxSegment.get('OBX.3.2');
        const unit = obxSegment.get('OBX.6.1');
        const date = obxSegment.get('OBX.14');
        let patientValue = obxSegment.get('OBX.5');
        patientValue = Number(patientValue);
        if (!isNaN(patientValue)) {
          const data = {
            gender,
            dateOfBirth,
            oruCode,
            unit,
            patientValue,
            patientId,
            patientName,
            date
          }
          results.push(data);
        }
      }
    }

    const outputData = [];
    const codes = results.map(result => result.oruCode);
    const metricData = await DiagnosticMetrics.find({ oru_sonic_codes: { $in: codes } }).lean();

    for (let i = 0; i < results.length; i++) {
      const { oruCode, unit } = results[i];
      const metric = find(metricData, { oru_sonic_codes: oruCode, units: unit });

      if (metric) {
        const {
          standard_lower,
          standard_higher,
          everlab_lower,
          everlab_higher
        } = metric;
        const { patientValue } = results[i];
        if (patientValue < standard_lower || patientValue > standard_higher) {
          outputData.push({ ...metric, ...results[i], abnormal: true });
        } else {
          outputData.push({ ...metric, ...results[i], abnormal: false });
        }

        if (patientValue < everlab_lower || patientValue > everlab_higher) {
          outputData.push({ ...metric, ...results[i], labAbnormal: true });
        } else {
          outputData.push({ ...metric, ...results[i], labAbnormal: false });
        }
      }
    }

    return outputData;
  } catch (error) {
    console.error('Error processing HL7 file:', error);
    throw error;
  }
};

export default ConvertHL7ToJSON;
