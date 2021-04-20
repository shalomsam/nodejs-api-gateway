let nodemailerConfig = {};

const baseConfig = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
};

const connectionString = process.env.SMTP_CONNECTION_STRING;

if (baseConfig.host && baseConfig.port) {
  nodemailerConfig = {
    ...nodemailerConfig,
    ...baseConfig,
  };
  if (baseConfig.user) {
    nodemailerConfig = {
      ...nodemailerConfig,
      secure: true,
    };
  }
}

if (connectionString) {
  nodemailerConfig = connectionString;
}

export default nodemailerConfig;
