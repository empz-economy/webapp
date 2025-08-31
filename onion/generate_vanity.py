from nacl.signing import SigningKey
import base64
import hashlib
import multiprocessing
import time
import re
import sys
import math

user_suffix = input(
    "Please enter any additional characters for your domain prefix after 'empz' (or '0' for none). "
).lower()
if user_suffix == "0":
    user_suffix = ""
elif not re.fullmatch(r"[a-z2-7]*", user_suffix):
    print("Invalid input. Please try again using only characters a-z and 2-7.")
    exit(1)
prefix = ("empz" + user_suffix).encode()
prefix_len = len(prefix)

# Estimate attempts based on prefix length
possible_chars = 32
estimated_attempts = possible_chars ** prefix_len

print(f"\nPrefix length: {prefix_len} chars")
print(f"Estimated attempts needed: {estimated_attempts:,}")
proceed = input("\nDo you want to proceed? This may take a long time. (y/n) ").lower()
if proceed != 'y':
    print("Generation cancelled.")
    exit(0)

attempts = multiprocessing.Value('i', 0)

def generate(attempts):
    start_time = time.time()
    last_print = start_time
    while True:
        signing_key = SigningKey.generate()
        private_key = signing_key.encode()
        public_key = signing_key.verify_key.encode()
        checksum = hashlib.sha3_256(b".onion checksum" + public_key + b"\x03").digest()[:2]
        onion_address_bytes = public_key + checksum + b"\x03"
        onion = base64.b32encode(onion_address_bytes).lower().rstrip(b"=") + b".onion"
        with attempts.get_lock():
            attempts.value += 1
        if onion.startswith(prefix):
            return private_key, onion.decode()
        # Print progress every second
        current_time = time.time()
        if current_time - last_print >= 1.0:
            with attempts.get_lock():
                a = attempts.value
                elapsed = current_time - start_time
                speed = a / elapsed if elapsed > 0 else 0
                remaining = (estimated_attempts - a) / speed if speed > 0 else float('inf')
                remaining_str = time.strftime("%Hh %Mm %Ss", time.gmtime(remaining)) if remaining != float('inf') else "unknown"
                print(f"\rAttempts: {a:,} | Speed: {speed:,.1f} attempts/sec | Est. remaining: {remaining_str}", end="", flush=True)
                last_print = current_time
        time.sleep(0.01)  # Sleeps for 10ms after each attempt

def worker(queue, attempts):
    pk, onion = generate(attempts)
    queue.put((pk, onion))

if __name__ == "__main__":
    manager = multiprocessing.Manager()
    q = manager.Queue()
    processes = []
    print("Starting vanity onion address generation...")
    for _ in range(multiprocessing.cpu_count()):
        p = multiprocessing.Process(target=worker, args=(q, attempts))
        p.start()
        processes.append(p)
    private_key, onion = q.get()
    for p in processes:
        p.terminate()
    print(f"\nFound matching address after {attempts.value:,} attempts: {onion}")
    with open("hs_ed25519_key.bi", "wb") as f:
        f.write(private_key)
    with open("base64.txt", "w") as f:
        f.write(base64.b64encode(private_key).decode())
    with open("domain.txt", "w") as f:
        f.write(onion)
    print(f"Your vanity onion domain has been successfully generated. Check out the folder you installed for the generated files.")
    print("Please remember to back up your private key securely.")