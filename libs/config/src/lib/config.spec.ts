import { config } from './config';

describe('Config', () => {
  it('Config get should work when no key is supplied', () => {
    const conf = config.get();
    expect(conf).toBeInstanceOf(Object);
    expect(conf).toEqual(expect.objectContaining({
      scheme: expect.any(String),
      domain: expect.any(String),
      port: expect.any(Number),
      baseUrl: expect.any(String),
      appEnv: expect.any(String),
      debug: expect.any(Boolean),
      mongoConnectionString: expect.any(String),
      adminClientKeys: expect.any(String),
      adminClientSecret: expect.any(String),
      cryptoSaltRounds: expect.any(Number),
      jwtTtl: expect.any(Number),
      algoName: expect.any(String),
      apiKeyHandle: expect.any(String),
      jwtTokenHandle: expect.any(String),
      cookieDomain: expect.any(String),
      passwordMinLength: expect.any(Number),
      passwordMaxLength: expect.any(Number),
      cacheTtl: expect.any(Number),
    }));
  });

  it('Config get should work when key is supplied', () => {
    const port = config.get('port');
    expect(typeof port).toBe('number');
  });

  it('Config put should update property value', () => {
    const mockAlgoName = 'SomeAlgoName';
    const algoName = config.get('algoName');
    expect(algoName).toBe('HS256');

    config.put('algoName', mockAlgoName);
    expect(config.get('algoName')).toBe(mockAlgoName);
  });

  it('Config Update method should update config object with given object', () => {
    const mockUpdateObj = { appEnv: 'production', someKey: "someValue" };
    const appEnv = config.get('appEnv');
    expect(appEnv).toBe('test');
    
    config.update(mockUpdateObj);
    expect(config.get()).toEqual(expect.objectContaining(mockUpdateObj));
  });
});
