const NAME_GARBAGE = new Set([
  "test",
  "testing",
  "asdf",
  "asdfgh",
  "qwerty",
  "qwertyui",
  "abc",
  "abcd",
  "abcdef",
  "xyz",
  "xxxx",
  "aaaa",
  "bbbb",
  "zzzz",
  "hello",
  "name",
  "username",
  "admin",
  "user",
  "null",
  "undefined",
  "none",
  "dummy",
  "fake",
  "random",
]);

const EMAIL_GARBAGE_DOMAINS = new Set([
  "example.com",
  "example.org",
  "example.net",
  "localhost",
]);

function clean(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function repeatedPattern(value: string): boolean {
  const compact = value.toLowerCase().replace(/\s+/g, "");
  if (compact.length < 3) return false;

  if (/^(.)\1{2,}$/u.test(compact)) return true;
  if (/^(.{1,3})\1{2,}$/u.test(compact)) return true;

  return false;
}

function keyboardMash(value: string): boolean {
  const compact = value.toLowerCase().replace(/[^a-z]/g, "");

  const patterns = [
    "asdf",
    "fdsa",
    "qwer",
    "rewq",
    "zxcv",
    "vcxz",
    "qaz",
    "wsx",
    "edc",
    "abc",
    "bcd",
    "cde",
    "xyz",
  ];

  return patterns.some(
    (pattern) =>
      compact === pattern ||
      compact.includes(pattern) ||
      compact === [...pattern].reverse().join(""),
  );
}

export function validatePersonName(value: string): string | null {
  const name = clean(value);

  if (!name) return "Name is required.";
  if (name.length < 2) return "Please enter a real name.";
  if (name.length > 80) return "Name is too long.";

  // Supports Bangla + English letters, spaces, apostrophes and hyphens.
  if (!/^[\p{L}\p{M}]+(?:[\s'-][\p{L}\p{M}]+)*$/u.test(name)) {
    return "Please enter a valid name using letters only.";
  }

  const normalized = name.toLowerCase().replace(/[\s'-]/g, "");

  if (NAME_GARBAGE.has(normalized)) {
    return "Please enter your actual name.";
  }

  if (repeatedPattern(name) || keyboardMash(name)) {
    return "Please enter your actual name, not random characters.";
  }

  return null;
}

export function normalizeBangladeshPhone(value: string): string {
  let phone = value.trim().replace(/[\s().-]/g, "");

  if (phone.startsWith("00880")) {
    phone = `+880${phone.slice(5)}`;
  } else if (phone.startsWith("880")) {
    phone = `+${phone}`;
  } else if (phone.startsWith("01")) {
    phone = `+880${phone.slice(1)}`;
  }

  return phone;
}

export function validateBangladeshPhone(value: string): string | null {
  const phone = normalizeBangladeshPhone(value);

  if (!phone) return "Phone number is required.";

  if (!/^\+8801[3-9]\d{8}$/.test(phone)) {
    return "Please enter a valid Bangladesh mobile number.";
  }

  return null;
}

export function validateEmail(value: string): string | null {
  const email = clean(value).toLowerCase();

  if (!email) return null;

  if (email.length > 254) return "Email address is too long.";

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ||
    email.includes("..")
  ) {
    return "Please enter a valid email address.";
  }

  const [localPart, domain] = email.split("@");

  if (!localPart || localPart.startsWith(".") || localPart.endsWith(".")) {
    return "Please enter a valid email address.";
  }

  if (EMAIL_GARBAGE_DOMAINS.has(domain)) {
    return "Please use a real email address.";
  }

  if (
    localPart.length < 2 ||
    repeatedPattern(localPart) ||
    /^(test|testing|fake|dummy|example|asdf|qwerty)[0-9._-]*$/i.test(localPart)
  ) {
    return "Please use your real email address.";
  }

  return null;
}

export function validateInstituteName(value: string): string | null {
  const name = clean(value);

  if (!name) return "Please enter your institute name.";
  if (name.length < 2) return "Please enter a valid institute name.";
  if (name.length > 150) return "Institute name is too long.";

  if (!/[\p{L}]/u.test(name)) {
    return "Please enter a real institute name.";
  }

  if (
    /^[-_.@#$%^&*()+=/\\]+$/u.test(name) ||
    repeatedPattern(name)
  ) {
    return "Please enter a real institute name.";
  }

  const normalized = name.toLowerCase().replace(/[^a-z]/g, "");

  if (
    NAME_GARBAGE.has(normalized) ||
    /^(test|testing|asdf|qwerty|dummy|fake|random)+$/i.test(normalized)
  ) {
    return "Please enter a real institute name.";
  }

  return null;
}

export function validateAcademicYear(value: string): string | null {
  const year = clean(value);

  if (!/^\d{4}$/.test(year)) {
    return "Please enter a valid four-digit academic year.";
  }

  const numericYear = Number(year);
  const currentYear = new Date().getFullYear();

  if (numericYear < 2000 || numericYear > currentYear + 2) {
    return "Please enter a realistic academic year.";
  }

  return null;
}

export function validateCampusName(value: string): string | null {
  const name = clean(value);

  if (!name) return "Please enter your campus name.";
  if (name.length < 2) return "Please enter a valid campus name.";
  if (name.length > 100) return "Campus name is too long.";

  if (!/[\p{L}]/u.test(name) || repeatedPattern(name)) {
    return "Please enter a real campus name.";
  }

  return null;
}

export function validateClassName(value: string): string | null {
  const name = clean(value);

  if (!name) return "Please enter a class name.";
  if (name.length > 80) return "Class name is too long.";

  if (!/[\p{L}\p{N}]/u.test(name)) {
    return "Please enter a valid class name.";
  }

  if (repeatedPattern(name) || keyboardMash(name)) {
    return "Please enter a valid class name.";
  }

  return null;
}

export function validateSection(value: string): string | null {
  const section = clean(value);

  if (!section) return null;
  if (section.length > 20) return "Section name is too long.";

  if (!/^[\p{L}\p{N}][\p{L}\p{N}\s&/-]*$/u.test(section)) {
    return "Please enter a valid section.";
  }

  if (repeatedPattern(section)) {
    return "Please enter a valid section.";
  }

  return null;
}

export function validateUsername(value: string): string | null {
  const username = clean(value).toLowerCase();

  if (username.length < 3) return "Username must be at least 3 characters.";
  if (username.length > 30) return "Username is too long.";

  if (!/^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$/.test(username)) {
    return "Use only letters, numbers, dots, hyphens, or underscores.";
  }

  if (repeatedPattern(username) || keyboardMash(username)) {
    return "Please choose a meaningful username.";
  }

  return null;
}
