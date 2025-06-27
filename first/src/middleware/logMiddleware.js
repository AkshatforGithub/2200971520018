

const LOGGING_API_URL = "http://20.244.56.144/evaluation-service/logs";

const log = async (stack, level, packageName, message) => {
  const payload = {
    stack: stack.toLowerCase(),
    level: level.toLowerCase(),
    package: packageName.toLowerCase(),
    message,
  };

  try {
    const res = await fetch(LOGGING_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.warn("Logging failed", res.status);
    }
  } catch (err) {
    console.error("Log error", err.message);
  }
};

export default log;
