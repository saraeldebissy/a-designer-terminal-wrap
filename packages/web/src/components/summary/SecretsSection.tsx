/**
 * Secrets detection section — exposed credentials with editorial voice
 */

import { motion } from 'motion/react';
import type { SecretsStats } from '../../api/types';
import { StaggeredList, StaggeredItem } from '../motion/StaggeredList';

export interface SecretsSectionProps {
  secrets: SecretsStats;
}

const EXPOSURE_NOTES = [
  'These commands contain credentials. Rotate them.',
  'Secrets in shell history can be read by anyone with access to this machine.',
  'Your history file carries live credentials. Revoke before sharing this output.',
  'Command history is plaintext on disk. These secrets are exposed.',
];

const ROAST_BY_TYPE: Record<string, string> = {
  'GitHub Token': 'GitHub tokens can grant repository write access. Revoke immediately.',
  'AWS Access Key': 'AWS access keys should be rotated and moved to a secrets manager.',
  'AWS Secret Key': 'AWS secret keys require immediate rotation.',
  'Database URL': 'Database credentials should never appear in shell history.',
  'API Key': 'API keys should be stored in protected config, not shell history.',
  'JWT Token': 'JWT exposure enables session impersonation. Invalidate the token.',
  'Slack Token': 'Revoke this and replace with scoped credentials.',
  'Environment Variable': 'Sensitive env values should not appear in shell commands.',
  'curl Credentials': 'Inline credentials in curl should use secure auth flows.',
  'Auth Header': 'Authorization headers should not live in shell history.',
  'Private Key': 'Private key material must be revoked and reissued.',
};

export function SecretsSection({ secrets }: SecretsSectionProps) {
  const { totalSecretsFound, secretTypes, potentialSecrets } = secrets;

  if (totalSecretsFound === 0) {
    return (
      <div className="rounded-3xl border border-[#1ed760]/30 bg-[#1ed760] p-8 text-center text-black">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-black"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M5 12l5 5L20 7" stroke="#1ed760" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
        <h3 className="mb-2 text-3xl font-extrabold">Clean Record</h3>
        <p className="mx-auto max-w-2xl text-lg font-medium text-black/70">
          No exposure detected. Keep it that way.
        </p>
      </div>
    );
  }

  const exposureNote = EXPOSURE_NOTES[Math.min(secretTypes.length - 1, EXPOSURE_NOTES.length - 1)];
  const primaryType = secretTypes[0]?.type;
  const typeNote = primaryType ? ROAST_BY_TYPE[primaryType] : null;

  return (
    <div className="space-y-6">
      <motion.div
        className="rounded-3xl border border-black/30 bg-[#f172cd] p-7 text-black"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-black">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              stroke="#f172cd"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line x1="12" y1="9" x2="12" y2="13" stroke="#f172cd" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="17" x2="12.01" y2="17" stroke="#f172cd" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <h3 className="mb-2 text-4xl font-extrabold">
          {totalSecretsFound} Secret{totalSecretsFound !== 1 ? 's' : ''} Exposed
        </h3>
        <p className="text-lg font-medium text-black/75">{exposureNote}</p>
      </motion.div>

      {typeNote && (
        <motion.div
          className="rounded-2xl border border-black/35 bg-[#d8ef3f] p-5 text-black"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-base font-medium">
            <span className="font-extrabold">Primary risk:</span> {typeNote}
          </p>
        </motion.div>
      )}

      {secretTypes.length > 0 && (
        <div>
          <h3 className="mb-3 text-[11px] uppercase tracking-[0.24em] text-white/50">
            Exposure Types
          </h3>
          <div className="flex flex-wrap gap-2">
            {secretTypes.map(({ type, count }) => (
              <motion.span
                key={type}
                className="rounded-full border border-white/20 bg-white/[0.07] px-3 py-1.5 text-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.04 }}
              >
                <span className="font-semibold text-white">{type}</span>
                <span className="ml-2 font-mono text-white/50">×{count}</span>
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {potentialSecrets.length > 0 && (
        <div>
          <h3 className="mb-3 text-[11px] uppercase tracking-[0.24em] text-white/50">
            Redacted Evidence
          </h3>
          <StaggeredList className="space-y-2">
            {potentialSecrets.slice(0, 5).map((secret, index) => (
              <StaggeredItem key={index}>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 transition-colors hover:border-[#f172cd]/50">
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="rounded bg-[#f172cd] px-2 py-0.5 text-xs font-bold text-black">
                      {secret.type}
                    </span>
                    <span className="font-mono text-xs text-white/35">#{index + 1}</span>
                  </div>
                  <code className="break-all font-mono text-xs text-white/70">
                    {secret.redactedCommand}
                  </code>
                </div>
              </StaggeredItem>
            ))}
          </StaggeredList>
          {potentialSecrets.length > 5 && (
            <p className="mt-3 text-center font-mono text-xs text-white/40">
              +{potentialSecrets.length - 5} more
            </p>
          )}
        </div>
      )}

      <motion.div
        className="border-t border-white/10 pt-4 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-sm text-white/40">
          Rotate exposed credentials and remove sensitive patterns from future commands.
        </p>
      </motion.div>
    </div>
  );
}
