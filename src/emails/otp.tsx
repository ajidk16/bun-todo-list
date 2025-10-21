import * as React from "react";
import {
  Tailwind,
  Container,
  Section,
  Row,
  Column,
  Text,
  Button,
} from "@react-email/components";

export type OtpEmailProps = {
  otp: string;
  verifyUrl?: string;
  supportEmail?: string;
  brandName?: string;
  expiresInMin?: number;
  username?: string;
};

export default function OTPEmail({
  otp,
  username,
  verifyUrl,
  supportEmail,
  brandName,
  expiresInMin,
}: OtpEmailProps) {
  const digits = [...otp.toString()];

  return (
    <Tailwind>
      <Section className="bg-slate-100 py-8">
        <Container className="mx-auto w-full max-w-[560px] px-4">
          {/* Kartu utama */}
          <Section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            {/* Header */}
            <Section className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5">
              <Row>
                <Column>
                  <div className="flex items-center gap-3 text-white">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                      {/* Logo placeholder (SVG inline agar aman di email) */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path d="M12 3l8.66 5v8L12 21l-8.66-5V8L12 3zm0 2.309L5.34 9 12 12.691 18.66 9 12 5.309z" />
                      </svg>
                    </div>
                    <div>
                      <Text className="m-0 text-[11px] uppercase tracking-wider text-white/70">
                        Keamanan Akun
                      </Text>
                      <Text className="m-0 text-base font-semibold text-white">
                        Verifikasi Kode OTP
                      </Text>
                    </div>
                  </div>
                </Column>
              </Row>
            </Section>

            {/* Body */}
            <Section className="px-6 py-6">
              <Text className="m-0 text-slate-700">Halo, {username}</Text>
              <Text className="mt-3 text-slate-700">
                Kami menerima permintaan untuk memverifikasi akun Anda. Masukkan
                kode OTP berikut pada aplikasi atau situs kami:
              </Text>

              {/* OTP Box */}
              <div className="mt-5 flex justify-center gap-2">
                {digits.map((d, i) => (
                  <span
                    key={`${d}-${i}`}
                    className="flex h-12 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-xl font-semibold tracking-widest text-slate-800"
                  >
                    {d}
                  </span>
                ))}
              </div>

              <Text className="mt-4 text-sm text-slate-600">
                Kode berlaku selama{" "}
                <span className="font-semibold text-slate-800">
                  {expiresInMin} menit
                </span>
                . Jangan bagikan OTP kepada siapa pun.
              </Text>

              {/* CTA */}
              <div className="mt-6 text-center">
                <Button
                  href={verifyUrl}
                  className="inline-block rounded-xl bg-indigo-600 px-5 py-3 text-center text-sm font-semibold text-white no-underline shadow"
                >
                  Verifikasi Sekarang
                </Button>
              </div>

              {/* Tips/Support */}
              <div className="mt-6 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <Text className="m-0 text-sm text-slate-700">
                  Tidak meminta verifikasi? Abaikan email ini. Jika Anda punya
                  pertanyaan, hubungi{" "}
                  <a
                    href={`mailto:${supportEmail}`}
                    className="text-indigo-600 underline"
                  >
                    {supportEmail}
                  </a>
                  .
                </Text>
              </div>

              {/* Secondary plain OTP */}
              <div className="mt-6">
                <Text className="m-0 text-[12px] text-slate-500">
                  Jika tombol tidak berfungsi, salin dan tempel kode ini:
                </Text>
                <code className="mt-1 inline-block rounded-lg bg-slate-100 px-2 py-1 text-sm font-semibold text-slate-800">
                  {otp}
                </code>
              </div>
            </Section>

            {/* Footer */}
            <Section className="border-t border-slate-200 bg-white px-6 py-5">
              <Text className="m-0 text-[12px] text-slate-500">
                Anda menerima email ini karena ada aktivitas masuk atau
                pendaftaran pada akun Anda.
              </Text>
              <Text className="m-0 mt-1 text-[12px] text-slate-500">
                © 2025 {brandName}, All rights reserved.
              </Text>
            </Section>
          </Section>

          {/* Footer legal minimal */}
          <Text className="mt-4 text-center text-[11px] leading-5 text-slate-500">
            Harap jangan membalas email ini. Kotak masuk ini tidak dipantau.
          </Text>
        </Container>
      </Section>
    </Tailwind>
  );
}

// /* Optional – data yang dipakai saat preview */
OTPEmail.PreviewProps = {
  otp: "832374",
  username: "Budi",
  verifyUrl: "https://example.com/verify",
  supportEmail: "support@example.com",
  brandName: "Desa Harmoni",
  expiresInMin: 10,
};
