/// <reference types="emscripten" />
/// <reference types="node" />
/// <reference lib="esnext.asynciterable" />

import type * as asn1 from '@yoursunny/asn1';
import assert from 'minimalistic-assert';
import { DataSet } from './esm';
import { Edge } from './esm';
import { IdType } from './esm';
import { Network } from './esm';
import { Node as Node_2 } from './esm';
import type { WebSocket as WebSocket_2 } from 'ws';

declare type AddField<K extends string, T, Required extends boolean, Repeat extends boolean> = Repeat extends true ? {
    [key in K]: T[];
} : Required extends true ? {
    [key in K]: T;
} : {
    [key in K]?: T;
};

declare type AddFlags<FlagPrefix extends string, FlagBit extends string> = {
    [key in `${FlagPrefix}${Capitalize<FlagBit>}`]: boolean;
};

/** AES block size in octets. */
declare const AesBlockSize = 16;

/**
 * AES-CBC encryption algorithm.
 *
 * @remarks
 * Initialization Vectors must be 16 octets.
 * During encryption, if IV is unspecified, it is randomly generated.
 * During decryption, quality of IV is not checked.
 */
declare const AESCBC: AesEncryption<{}, AESCBC.GenParams>;

declare namespace AESCBC {
    interface GenParams extends AesGenParams {
    }
}

/**
 * AES-CTR encryption algorithm.
 *
 * @remarks
 * Initialization Vectors must be 16 octets.
 * During encryption, if IV is unspecified, it is constructed with two parts:
 * 1. 64-bit random number, generated each time a private key instance is constructed.
 * 2. 64-bit counter starting from zero.
 *
 * During decryption, quality of IV is not automatically checked.
 * Since the security of AES-CTR depends on having unique IVs, the application should check IV
 * uniqueness with {@link CounterIvChecker}.
 */
declare const AESCTR: AesEncryption<AESCTR.Info, AESCTR.GenParams>;

declare namespace AESCTR {
    interface Info {
        /**
         * Specify number of bits in IV to use as counter.
         * This must be between 1 and 128.
         * @defaultValue 64
         */
        counterLength: number;
    }
    type GenParams = AesGenParams & Partial<Info>;
}

/** AES encryption algorithm. */
declare interface AesEncryption<I, G extends AesGenParams> extends EncryptionAlgorithm<I, false, G> {
    readonly ivLength: number;
    makeAesKeyGenParams: (genParams: G) => AesKeyGenParams;
}

/**
 * AES-GCM encryption algorithm.
 *
 * @remarks
 * Initialization Vectors must be 12 octets.
 * During encryption, if IV is unspecified, it is constructed with two parts:
 * 1. 64-bit random number, generated each time a private key instance is constructed;
 * 2. 32-bit counter starting from zero.
 *
 * During decryption, quality of IV is not automatically checked.
 * Since the security of AES-GCM depends on having unique IVs, the application should check IV
 * uniqueness with {@link CounterIvChecker}.
 */
declare const AESGCM: AesEncryption<{}, AESGCM.GenParams>;

declare namespace AESGCM {
    interface GenParams extends AesGenParams {
    }
}

/** AES key generation parameters. */
declare interface AesGenParams {
    length?: AesKeyLength;
    /** Import raw key bits instead of generating. */
    importRaw?: Uint8Array;
}

/** AES key length option. */
declare type AesKeyLength = (typeof AesKeyLength.Choices)[number];

declare namespace AesKeyLength {
    const Default: AesKeyLength;
    const Choices: readonly [128, 192, 256];
}

/** Print Generic, ImplicitDigest, ParamsDigest in alternate URI syntax. */
declare const AltUri: AltUriConverter;

/**
 * Functions to print and parse names in alternate/pretty URI syntax.
 *
 * @remarks
 * This class is constructed with a sequence of `NamingConvention`s. Each component is matched
 * against these conventions in order, and the first matching convention can determine how to
 * print that component in an alternate URI syntax, if available.
 *
 * Other than pre-constructed `AltUri` instances exported by this and naming convention packages,
 * you may construct an instance with only the naming conventions you have adopted, so that a
 * component that happens to match a convention that your application did not adopt is not
 * mistakenly interpreted with that convention.
 */
declare class AltUriConverter {
    readonly conventions: ReadonlyArray<NamingConvention<any> & NamingConvention.WithAltUri>;
    constructor(conventions: ReadonlyArray<NamingConvention<any> & NamingConvention.WithAltUri>);
    /** Print component in alternate URI syntax */
    readonly ofComponent: (comp: Component) => string;
    /** Print name in alternate URI syntax. */
    readonly ofName: (name: Name) => string;
    /** Parse component from alternate URI syntax */
    readonly parseComponent: (input: string) => Component;
    /** Parse name from alternate URI syntax. */
    readonly parseName: (input: string) => Name;
}

/** Convert ArrayBuffer or ArrayBufferView to DataView. */
declare function asDataView(a: BufferSource): DataView;

/** Convert ArrayBuffer or ArrayBufferView to Uint8Array. */
declare function asUint8Array(a: BufferSource): Uint8Array;

/** A Bloom filter. */
declare class BloomFilter {
    private readonly m;
    /**
     * Construct a Bloom filter.
     * @param p - Algorithm parameter.
     * @param wire - Decode from serialized wire encoding.
     * @returns Promise that resolves to BloomFilter instance.
     */
    static create(p: Parameters_2, wire?: Uint8Array): Promise<BloomFilter>;
    /** @deprecated No longer needed. */
    dispose(): void;
    /** Clear the Bloom filter. */
    clear(): void;
    /** Insert a value to the Bloom filter. */
    insert(s: string | Uint8Array): void;
    /** Determine whether the Bloom filter probably contains a value. */
    contains(s: string | Uint8Array): boolean;
    /** Serialize the Bloom filter. */
    encode(): Uint8Array;
    private constructor();
    private readonly c;
    private readonly hashFunction;
}

declare interface BloomFilter extends Readonly<Parameters_2> {
}

/**
 * NDN Certificate v2.
 *
 * @remarks
 * This type is immutable.
 */
declare class Certificate {
    readonly data: Data;
    readonly validity: ValidityPeriod;
    /**
     * Construct Certificate from Data packet.
     *
     * @throws Error
     * Thrown if the Data packet is not a certificate.
     */
    static fromData(data: Data): Certificate;
    private constructor();
    /** Certificate name aka Data packet name. */
    get name(): Name;
    /** KeyLocator name, if present. */
    get issuer(): Name | undefined;
    /**
     * Whether this is a self-signed certificate.
     *
     * @remarks
     * A certificate is considered self-signed if its issuer key name is same as the certificate's
     * key name, i.e. they are the same key.
     */
    get isSelfSigned(): boolean;
    /**
     * Ensure certificate is within validity period.
     *
     * @throws Error
     * Certificate has expired as of `now`.
     */
    checkValidity(now?: ValidityPeriod.TimestampInput): void;
    /** Public key in SubjectPublicKeyInfo (SPKI) binary format. */
    get publicKeySpki(): Uint8Array;
    /**
     * Import SPKI as public key.
     * @param algoList - Algorithm list, such as {@link SigningAlgorithmListSlim}.
     */
    importPublicKey<I, A extends CryptoAlgorithm<I>>(algoList: readonly A[]): Promise<[A, CryptoAlgorithm.PublicKey<I>]>;
}

declare namespace Certificate {
    /** {@link Certificate.build} options. */
    interface BuildOptions {
        /** Certificate name. */
        name: Name;
        /**
         * Certificate packet FreshnessPeriod.
         * @defaultValue 1 hour
         */
        freshness?: number;
        /** ValidityPeriod. */
        validity: ValidityPeriod;
        /** Public key in SubjectPublicKeyInfo (SPKI) binary format. */
        publicKeySpki: Uint8Array;
        /** Issuer signing key. */
        signer: Signer;
    }
    /** Build a certificate from fields. */
    function build({ name, freshness, validity, publicKeySpki, signer, }: BuildOptions): Promise<Certificate>;
    /** {@link Certificate.issue} options. */
    interface IssueOptions {
        /**
         * Certificate packet FreshnessPeriod.
         * @defaultValue 1 hour
         */
        freshness?: number;
        /** ValidityPeriod. */
        validity: ValidityPeriod;
        /** IssuerId in certificate name. */
        issuerId: Component;
        /** Issuer signing key. */
        issuerPrivateKey: Signer;
        /** Public key to appear in certificate. */
        publicKey: PublicKey;
    }
    /** Create a certificated signed by issuer. */
    function issue(opts: IssueOptions): Promise<Certificate>;
    /** {@link Certificate.selfSign} options. */
    interface SelfSignOptions {
        /**
         * Certificate packet FreshnessPeriod.
         * @defaultValue 1 hour
         */
        freshness?: number;
        /**
         * ValidityPeriod
         * @defaultValue
         * Maximum validity.
         */
        validity?: ValidityPeriod;
        /** Private key corresponding to public key. */
        privateKey: NamedSigner;
        /** Public key to appear in certificate. */
        publicKey: PublicKey;
    }
    /** Create a self-signed certificate. */
    function selfSign(opts: SelfSignOptions): Promise<Certificate>;
}

declare interface CertNameFields extends KeyNameFields {
    issuerId: Component;
    version: Component;
    keyName: Name;
}

declare namespace CertNaming {
    export {
        toSubjectName,
        isKeyName,
        parseKeyName,
        toKeyName,
        makeKeyName,
        isCertName,
        parseCertName,
        makeCertName,
        KEY,
        ISSUER_DEFAULT,
        ISSUER_SELF,
        KeyNameFields,
        CertNameFields
    }
}

/** KV store of certificates. */
declare class CertStore extends StoreBase<StoredCert> {
    get(name: Name): Promise<Certificate>;
    insert(cert: Certificate): Promise<void>;
}

declare interface Closer {
    close: () => void;
}

declare namespace Closer {
    /** Close or dispose an object. */
    function close(c: any): Promisable<void>;
    /** Convert a closable object to AsyncDisposable. */
    function asAsyncDisposable(c: Closer | Disposable | AsyncDisposable): AsyncDisposable;
}

/** A list of objects that can be closed or disposed. */
declare class Closers extends Array<Closer | Disposable | AsyncDisposable> implements Disposable {
    /**
     * Close all objects and clear the list.
     *
     * @remarks
     * All objects added to this array are closed, in the reversed order as they appear in the array.
     * This is a synchronous function, so that any AsyncDisposable objects in the array would have its
     * asyncDispose method is called but not awaited.
     * This array is cleared and can be reused.
     */
    readonly close: () => void;
    [Symbol.dispose](): void;
    /** Schedule a timeout or interval to be canceled upon close. */
    addTimeout<T extends NodeJS.Timeout | number>(t: T): T;
    /** Wait for close. */
    wait(): Promise<void>;
}

/**
 * Name component.
 *
 * @remarks
 * This type is immutable.
 */
declare class Component {
    static decodeFrom(decoder: Decoder): Component;
    /** Parse from URI representation, or return existing Component. */
    static from(input: ComponentLike): Component;
    /**
     * Construct from TLV-TYPE and TLV-VALUE.
     * @param type - TLV-TYPE. Default is GenericNameComponent.
     * @param value - TLV-VALUE. If specified as string, it's encoded as UTF-8 but not interpreted
     *                as URI. Use `Component.from()` to interpret URI.
     *
     * @throws Error
     * Thrown if `type` is not a valid name component TLV-TYPE.
     */
    constructor(type?: number, value?: Uint8Array | string);
    /**
     * Decode from TLV.
     *
     * @throws Error
     * Thrown if `tlv` does not contain a complete name component TLV and nothing else.
     */
    constructor(tlv: Uint8Array);
    /** @internal */
    constructor(type: number, isFrom: typeof FROM, encoder: Encoder, length: number);
    /** Whole TLV. */
    readonly tlv: Uint8Array;
    /** TLV-TYPE. */
    readonly type: number;
    /** TLV-VALUE. */
    readonly value: Uint8Array;
    /** TLV-LENGTH. */
    get length(): number;
    /** TLV-VALUE interpreted as UTF-8 string. */
    get text(): string;
    /** Get URI string. */
    toString(): string;
    encodeTo(encoder: Encoder): void;
    /** Determine if component follows a naming convention. */
    is(convention: NamingConvention<any>): boolean;
    /** Convert with naming convention. */
    as<R>(convention: NamingConvention<any, R>): R;
    /** Compare this component with other. */
    compare(other: ComponentLike): Component.CompareResult;
    /** Determine if this component equals other. */
    equals(other: ComponentLike): boolean;
}

declare namespace Component {
    /** Component compare result. */
    enum CompareResult {
        /** lhs is less than rhs */
        LT = -2,
        /** lhs and rhs are equal */
        EQUAL = 0,
        /** lhs is greater than rhs */
        GT = 2
    }
}

/** Name component or component URI. */
declare type ComponentLike = Component | string;

declare interface Compression {
    compress: (input: Uint8Array) => Uint8Array;
    decompress: (compressed: Uint8Array) => Uint8Array;
}

/** Concatenate Uint8Arrays. */
declare function concatBuffers(arr: readonly Uint8Array[], totalLength?: number): Uint8Array;

/** Console on stderr. */
declare const console_2: Console;

/**
 * Ensure n is an integer within `[0,MAX_SAFE_INTEGER]` range.
 * @param n - Input number.
 * @param typeName - Description of the number type.
 *
 * @throws RangeError
 * Thrown if n is out of valid range.
 */
declare function constrain(n: number, typeName: string): number;

/**
 * Ensure n is an integer within `[0,max]` range.
 * @param n - Input number.
 * @param typeName - Description of the number type.
 * @param max - Maximum allowed value (inclusive).
 *
 * @throws RangeError
 * Thrown if n is out of valid range.
 */
declare function constrain(n: number, typeName: string, max: number): number;

/**
 * Ensure n is an integer within `[min,max]` range.
 * @param n - Input number.
 * @param typeName - Description of the number type.
 * @param min - Minimum allowed value (inclusive).
 * @param max - Maximum allowed value (inclusive).
 *
 * @throws RangeError
 * Thrown if n is out of valid range.
 */
declare function constrain(n: number, typeName: string, min: number, max: number): number;

/**
 Matches a [`class` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes).

 @category Class
 */
declare type Constructor<T, Arguments extends unknown[] = any[]> = new(...arguments_: Arguments) => T;

/**
 * Progress of Data retrieval.
 *
 * @remarks
 * This is a Promise that resolves with the retrieved Data and rejects upon timeout,
 * annotated with the Interest and some counters.
 */
declare interface ConsumerContext extends Promise<Data> {
    readonly interest: Interest;
    readonly nRetx: number;
}

/** {@link Endpoint.consume} options. */
declare interface ConsumerOptions {
    /**
     * Description for debugging purpose.
     * @defaultValue
     * "consume" + Interest name.
     */
    describe?: string;
    /** AbortSignal that allows canceling the Interest via AbortController. */
    signal?: AbortSignal;
    /**
     * Modify Interest according to specified options.
     * @defaultValue
     * `undefined`, no modification.
     */
    modifyInterest?: Interest.Modify;
    /**
     * Retransmission policy.
     * @defaultValue
     * `undefined`, no retransmission.
     */
    retx?: RetxPolicy;
    /**
     * Data verifier.
     * @defaultValue
     * `undefined`, no verification.
     */
    verifier?: Verifier;
}

/**
 * Check Initialization Vectors of fixed+random+counter structure for duplication.
 * @see {@link CounterIvOptions} for expected IV structure.
 */
declare class CounterIvChecker extends IvChecker {
    constructor(opts: CounterIvChecker.Options);
    private readonly fixedMask;
    private readonly randomMask;
    private readonly counterMask;
    private readonly fixed;
    private readonly requireSameRandom;
    private lastRandom?;
    private readonly ci;
    extract(iv: Uint8Array): {
        fixed: bigint;
        random: bigint;
        counter: bigint;
    };
    protected check(iv: Uint8Array, plaintextLength: number, ciphertextLength: number): void;
}

declare namespace CounterIvChecker {
    interface Options extends CounterIvOptions {
        /**
         * If true, all IVs must have the same bits in the random portion.
         * @defaultValue false
         */
        requireSameRandom?: boolean;
    }
}

/**
 * Generate Initialization Vectors using fixed+random+counter structure.
 * @see {@link CounterIvOptions} for expected IV structure.
 */
declare class CounterIvGen extends IvGen {
    constructor(opts: CounterIvGen.Options);
    private readonly ivPrefix;
    private readonly ci;
    protected generate(): Uint8Array;
    protected update(plaintextLength: number, ciphertextLength: number): void;
}

declare namespace CounterIvGen {
    interface Options extends CounterIvOptions {
    }
}

/**
 * Options for Initialization Vectors using fixed+random+counter structure.
 *
 * IVs following this construction method have three parts:
 * 1. fixed bits, specified in options.
 * 2. random bits, different for each key and in each session.
 * 3. counter bits, monotonically increasing for each plaintext/ciphertext block.
 */
declare interface CounterIvOptions {
    /** IV length in octets. */
    ivLength: number;
    /**
     * Number of fixed bits.
     * @defaultValue 0
     */
    fixedBits?: number;
    /**
     * Fixed portion.
     *
     * @remarks
     * Required if fixedBits is positive.
     * This may be specified as a bigint or a Uint8Array.
     * If it's a Uint8Array, it must have at least fixedBits bits.
     * The least significant bits are taken.
     */
    fixed?: bigint | Uint8Array;
    /** Number of counter bits. */
    counterBits: number;
    /**
     * Crypto algorithm block size in octets.
     * If plaintext and ciphertext have different lengths, the longer length is considered.
     */
    blockSize: number;
}

/**
 * Create a plain decrypter from crypto key.
 * @param algo - Encryption algorithm.
 * @param key - Private key or secret key, which must match `algo`.
 */
declare function createDecrypter<I>(algo: EncryptionAlgorithm<I>, key: CryptoAlgorithm.PrivateSecretKey<I>): LLDecrypt.Key;

/**
 * Create a named decrypter from crypto key.
 * @param name - Key name.
 * @param algo - Encryption algorithm.
 * @param key - Private key or secret key, which must match `algo`.
 */
declare function createDecrypter<I, Asym extends boolean>(name: Name, algo: EncryptionAlgorithm<I, Asym>, key: CryptoAlgorithm.PrivateSecretKey<I>): NamedDecrypter<Asym>;

/**
 * Create a plain encrypter from crypto key.
 * @param algo - Encryption algorithm.
 * @param key - Public key or secret key, which must match `algo`.
 */
declare function createEncrypter<I>(algo: EncryptionAlgorithm<I>, key: CryptoAlgorithm.PublicSecretKey<I>): LLEncrypt.Key;

/**
 * Create a named encrypter from crypto key.
 * @param name - Key name.
 * @param algo - Encryption algorithm.
 * @param key - Public key or secret key, which must match `algo`.
 */
declare function createEncrypter<I, Asym extends boolean>(name: Name, algo: EncryptionAlgorithm<I, Asym>, key: CryptoAlgorithm.PublicSecretKey<I>): NamedEncrypter<Asym>;

/**
 * Create a named encrypter from the public key in a certificate.
 * @param cert - Certificate.
 * @param opts - Certificate import options.
 */
declare function createEncrypter(cert: Certificate, opts?: ImportCertOptions<EncryptionAlgorithm>): Promise<NamedEncrypter.PublicKey>;

/**
 * Create a plain signer from crypto key.
 * @param algo - Signing algorithm.
 * @param key - Private key or secret key, which must match `algo`.
 */
declare function createSigner<I>(algo: SigningAlgorithm<I>, key: CryptoAlgorithm.PrivateSecretKey<I>): Signer;

/**
 * Create a named signer from crypto key.
 * @param name - Key name.
 * @param algo - Signing algorithm.
 * @param key - Private key or secret key, which must match `algo`.
 */
declare function createSigner<I, Asym extends boolean>(name: Name, algo: SigningAlgorithm<I, Asym>, key: CryptoAlgorithm.PrivateSecretKey<I>): NamedSigner<Asym>;

/**
 * Create a plain verifier from crypto key.
 * @param algo - Signing algorithm.
 * @param key - Public key or secret key, which must match `algo`.
 */
declare function createVerifier<I>(algo: SigningAlgorithm<I>, key: CryptoAlgorithm.PublicSecretKey<I>): Verifier;

/**
 * Create a named verifier from crypto key.
 * @param name - Key name.
 * @param algo - Signing algorithm.
 * @param key - Public key or secret key, which must match `algo`.
 */
declare function createVerifier<I, Asym extends boolean>(name: Name, algo: SigningAlgorithm<I, Asym>, key: CryptoAlgorithm.PublicSecretKey<I>): NamedVerifier<Asym>;

/**
 * Create a named verifier from the public key in a certificate.
 * @param cert - Certificate.
 * @param opts - Certificate import options.
 */
declare function createVerifier(cert: Certificate, opts?: ImportCertOptions<SigningAlgorithm>): Promise<NamedVerifier.PublicKey>;

/** Web Crypto API. */
declare const crypto_2: Crypto;

/**
 * WebCrypto based algorithm implementation.
 * @typeParam I - Algorithm-specific per-key information.
 * @typeParam Asym - Whether the algorithm is asymmetric.
 * @typeParam G - Key generation parameters.
 */
declare interface CryptoAlgorithm<I = any, Asym extends boolean = any, G = any> {
    /**
     * Identifies an algorithm in storage.
     *
     * @remarks
     * This should be changed when the serialization format changes.
     */
    readonly uuid: string;
    /**
     * WebCrypto KeyUsages for generated keys.
     * These are specified separately for private/public/secret keys.
     */
    readonly keyUsages: If<Asym, Record<"private" | "public", readonly KeyUsage[]>, Record<"secret", readonly KeyUsage[]>, {}>;
    /**
     * Generate key pair (for asymmetric algorithm) or secret key (for symmetric algorithm).
     * @param params - Key generation parameters.
     * @param extractable - Whether to generate as extractable WebCrypto key.
     * @returns Generated key pair or secret key.
     *
     * @remarks
     * Some algorithms allow importing an existing key pair from a serialization format such as
     * PKCS#8 or JWK. This could be supported by passing the serialized key as part of `params`,
     * and then importing instead of generating in this method.
     */
    cryptoGenerate: (params: G, extractable: boolean) => Promise<If<Asym, CryptoAlgorithm.GeneratedKeyPair<I>, CryptoAlgorithm.GeneratedSecretKey<I>, never>>;
    /**
     * Import public key from SubjectPublicKeyInfo.
     *
     * @remarks
     * This should only appear on asymmetric algorithm.
     */
    importSpki?: (spki: Uint8Array, der: asn1.ElementBuffer) => Promise<CryptoAlgorithm.PublicKey<I>>;
}

declare namespace CryptoAlgorithm {
    /** Determine whether `algo` is an asymmetric algorithm. */
    function isAsym<I, G>(algo: CryptoAlgorithm<I, any, G>): algo is CryptoAlgorithm<I, true, G>;
    /** Determine whether `algo` is a symmetric algorithm. */
    function isSym<I, G>(algo: CryptoAlgorithm<I, any, G>): algo is CryptoAlgorithm<I, false, G>;
    /** Determine whether `algo` is a signing algorithm. */
    function isSigning<I, Asym extends boolean = any, G = any>(algo: CryptoAlgorithm<I, Asym, G>): algo is SigningAlgorithm<I, Asym, G>;
    /** Determine whether `algo` is an encryption algorithm. */
    function isEncryption<I, Asym extends boolean = any, G = any>(algo: CryptoAlgorithm<I, Asym, G>): algo is EncryptionAlgorithm<I, Asym, G>;
    /** Private key used by an asymmetric algorithm. */
    interface PrivateKey<I = any> {
        privateKey: CryptoKey;
        info: I;
    }
    /** Public key used by an asymmetric algorithm. */
    interface PublicKey<I = any> {
        publicKey: CryptoKey;
        spki: Uint8Array;
        info: I;
    }
    /** Secret key used by a symmetric algorithm. */
    interface SecretKey<I = any> {
        secretKey: CryptoKey;
        info: I;
    }
    /** Pick {@link PrivateKey} or {@link SecretKey} based on whether the algorithm is asymmetric. */
    type PrivateSecretKey<I = any, Asym extends boolean = any> = If<Asym, PrivateKey<I>, SecretKey<I>>;
    /** Pick {@link PublicKey} or {@link SecretKey} based on whether the algorithm is asymmetric. */
    type PublicSecretKey<I = any, Asym extends boolean = any> = If<Asym, PublicKey<I>, SecretKey<I>>;
    /** Generated public/private key pair of an asymmetric algorithm. */
    interface GeneratedKeyPair<I = any> extends PrivateKey<I>, PublicKey<I> {
        jwkImportParams: AlgorithmIdentifier;
    }
    /** Generated secret key of a symmetric algorithm. */
    interface GeneratedSecretKey<I = any> extends SecretKey<I> {
        jwkImportParams: AlgorithmIdentifier;
    }
}

/**
 * A full list of crypto algorithms.
 *
 * @remarks
 * The *full* list contains all implemented algorithms.
 * This list encompasses {@link SigningAlgorithmListFull} and {@link EncryptionAlgorithmListFull}.
 *
 * This can be used in place of {@link CryptoAlgorithmListSlim} to support more algorithms,
 * at the cost of larger bundle size. If you know exactly which algorithms are needed, you can
 * also explicitly import them and form an array.
 */
declare const CryptoAlgorithmListFull: readonly CryptoAlgorithm[];

/**
 * A slim list of crypto algorithms.
 *
 * @remarks
 * The *slim* list contains only the most commonly used algorithms, to reduce bundle size.
 * This list encompasses {@link SigningAlgorithmListSlim} and {@link EncryptionAlgorithmListSlim}.
 * If you need more algorithms, explicitly import them or use {@link CryptoAlgorithmListFull}.
 */
declare const CryptoAlgorithmListSlim: readonly CryptoAlgorithm[];

declare const ctorAssign: unique symbol;

declare const ctorAssign_2: unique symbol;

declare const ctorAssign_3: unique symbol;

declare interface CtorTag {
    [ctorAssign]: (si: SigInfo) => void;
}

declare interface CtorTag_2 {
    [ctorAssign_2]: (f: Fields_2) => void;
}

declare interface CtorTag_3 {
    [ctorAssign_3]: (f: Fields) => void;
}

/** CustomEvent object. */
declare const CustomEvent_2: typeof globalThis["CustomEvent"];

/** Data packet. */
declare class Data implements LLSign.Signable, LLVerify.Verifiable, Signer.Signable, Verifier.Verifiable {
    /**
     * Construct from flexible arguments.
     *
     * @remarks
     * Arguments can include, in any order unless otherwise specified:
     * - Data to copy from
     * - {@link Name} or name URI
     * - {@link Data.ContentType}`(v)`
     * - {@link Data.FreshnessPeriod}`(v)`
     * - {@link Data.FinalBlock} (must appear after Name)
     * - `Uint8Array` as Content
     */
    constructor(...args: Array<Data | Data.CtorArg>);
    readonly [FIELDS]: Fields;
    static decodeFrom(decoder: Decoder): Data;
    encodeTo(encoder: Encoder): void;
    private encodeSignedPortion;
    /** Return the implicit digest if it's already computed. */
    getImplicitDigest(): Uint8Array | undefined;
    /** Compute the implicit digest. */
    computeImplicitDigest(): Promise<Uint8Array>;
    /** Return the full name if the implicit digest is already computed. */
    getFullName(): Name | undefined;
    /** Compute the full name (name plus implicit digest). */
    computeFullName(): Promise<Name>;
    /**
     * Determine if this Data can satisfy an Interest.
     * @returns Promise that resolves with the result.
     */
    canSatisfy(interest: Interest, { isCacheLookup }?: Data.CanSatisfyOptions): Promise<boolean>;
    [LLSign.OP](sign: LLSign): Promise<void>;
    [LLVerify.OP](verify: LLVerify): Promise<void>;
}

declare interface Data extends PublicFields_2 {
}

declare namespace Data {
    /** Constructor argument to set ContentType field. */
    function ContentType(v: number): CtorTag_3;
    /** Constructor argument to set FreshnessPeriod field. */
    function FreshnessPeriod(v: number): CtorTag_3;
    /** Constructor argument to set the current packet as FinalBlock. */
    const FinalBlock: unique symbol;
    /** Constructor argument. */
    type CtorArg = NameLike | CtorTag_3 | typeof FinalBlock | Uint8Array;
    /** {@link Data.canSatisfy} options. */
    interface CanSatisfyOptions {
        /**
         * Whether the Interest-Data matching is in the context of cache lookup.
         * If `true`, Data with zero FreshnessPeriod cannot satisfy Interest with MustBeFresh.
         * If `false`, this check does not apply.
         * @defaultValue false
         */
        isCacheLookup?: boolean;
    }
}

/** Outgoing Data buffer for producer. */
declare interface DataBuffer {
    find: (interest: Interest) => Promise<Data | undefined>;
    insert: (...pkts: readonly Data[]) => Promise<void>;
}

declare namespace DataStore {
    export {
        ListNames,
        ListData,
        Get,
        Find,
        Insert,
        Delete
    }
}

declare interface DataStore_2 {
    find: (interest: Interest) => Promise<Data | undefined>;
    insert: (opts: {
        expireTime?: number;
    }, ...pkts: readonly Data[]) => Promise<void>;
}

/** DataBuffer implementation based on `DataStore` from `@ndn/repo` package. */
declare class DataStoreBuffer implements DataBuffer {
    readonly store: DataStore_2;
    /**
     * Constructor.
     * @param store - {@link \@ndn/repo!DataStore} instance.
     *
     * @example
     * ```ts
     * new DataStoreBuffer(await makeInMemoryDataStore())
     * ```
     *
     * @remarks
     * `DataStore` is declared as an interface instead of importing, in order to reduce bundle size
     * for webapps that do not use DataBuffer. The trade-off is that, applications wanting to use
     * DataBuffer would have to import `@ndn/repo` themselves.
     */
    constructor(store: DataStore_2, { ttl, dataSigner, }?: DataStoreBuffer.Options);
    private readonly ttl;
    private readonly dataSigner?;
    find(interest: Interest): Promise<Data | undefined>;
    insert(...pkts: Data[]): Promise<void>;
}

declare namespace DataStoreBuffer {
    /** {@link DataStoreBuffer} constructor options. */
    interface Options {
        /**
         * Data expiration time in milliseconds.
         * 0 means infinity.
         * @defaultValue 60000
         */
        ttl?: number;
        /**
         * If specified, automatically sign Data packets unless already signed.
         * @see {@link ProducerOptions.dataSigner}
         */
        dataSigner?: Signer;
    }
}

declare interface DCT {
    /** Compile a trust schema. */
    schemaCompile: (opts: {
        /** input file */
        input: string;
        /** output file */
        output?: string;
        /** quiet (no diagnostic output) */
        quiet?: boolean;
        /** increase diagnostic level */
        verbose?: boolean;
        /** debug (highest diagnostic level) */
        debug?: boolean;
        /** print schema's cert DAG then exit */
        printDAG?: boolean;
        /** print compiler version and exit */
        version?: boolean;
    }) => Promise<string>;
    /** Get information about a trust schema. */
    schema_info: (opts: {
        /** input binary schema */
        input: string;
        /** pass option -c */
        c?: boolean;
        /** pass option -t */
        t?: boolean;
        /** publication name */
        pubname?: string;
    }) => Promise<string>;
    /** Generate a self-signed certificate. */
    make_cert: (opts: {
        /** Type of signature (e.g. EdDSA) */
        sigType?: string;
        /** Output file */
        output?: string;
        /** Name of certificate */
        name: string;
        /** Signer of cert */
        signer?: string;
    }) => Promise<void>;
    /** Sign a schema to create a schema certificate */
    schema_cert: (opts: {
        /** Output file */
        output?: string;
        /** Input schema file */
        input: string;
        /** Schema signer */
        signer?: string;
    }) => Promise<void>;
    make_bundle: (opts: {
        /** Increase output level */
        verbose?: boolean;
        /** Output file */
        output: string;
        /** Input files */
        input: string[];
    }) => Promise<void>;
    schema_dump: (opts: {
        input: string;
    }) => Promise<string>;
}

declare interface DebugEntry {
    action: string;
    ownIblt: IBLT;
    recvIblt?: IBLT;
    state?: PSyncCore.State;
}

declare interface DebugEntry_2 {
    action: string;
    interestName?: Name;
}

declare interface DebugEntry_3 {
    action: string;
}

declare interface DebugEntry_4 {
    action: string;
    key?: number;
    name?: Name;
    ownIblt: IBLT;
    recvIblt?: IBLT;
    content?: Name[];
}

declare interface DebugEntry_5 {
    action: string;
    own: Record<string, number>;
    recv?: Record<string, number>;
    state: string;
    nextState?: string;
    ourOlder?: number;
    ourNewer?: number;
}

/**
 * An object that knows how to decode itself from TLV.
 * @typeParam R - Result type.
 *
 * @remarks
 * Most commonly, `decodeFrom` is added as a static method of type R, so that the constructor
 * of R implements this interface.
 */
declare interface Decodable<R> {
    decodeFrom: (decoder: Decoder) => R;
}

/** TLV decoder. */
declare class Decoder {
    private readonly input;
    constructor(input: Uint8Array);
    private readonly dv;
    private offset;
    /** Determine whether end of input has been reached. */
    get eof(): boolean;
    /**
     * Ensure EOF has been reached.
     *
     * @throws Error
     * Thrown if EOF has not been reached.
     */
    throwUnlessEof(): void;
    /**
     * Read the next TLV structure from input.
     * @returns TLV structure.
     *
     * @throws Error
     * Thrown if there isn't a complete TLV structure in the input.
     */
    read(): Decoder.Tlv;
    /** Read a Decodable object. */
    decode<R>(d: Decodable<R>): R;
    /**
     * Read a variable-size number.
     * @returns The number up to uint32 or `undefined` if there isn't a complete number.
     */
    private readVarNum;
}

declare namespace Decoder {
    /** Decoded TLV. */
    interface Tlv {
        /** TLV-TYPE. */
        readonly type: number;
        /** TLV-LENGTH. */
        readonly length: number;
        /** TLV-VALUE. */
        readonly value: Uint8Array;
        /** TLV buffer. */
        readonly tlv: Uint8Array;
        /** Size of TLV. */
        readonly size: number;
        /** TLV as decoder. */
        readonly decoder: Decoder;
        /** TLV-VALUE as decoder. */
        readonly vd: Decoder;
        /** TLV-VALUE as non-negative integer. */
        readonly nni: number;
        /** TLV-VALUE as non-negative integer bigint. */
        readonly nniBig: bigint;
        /** TLV-VALUE as UTF-8 string. */
        readonly text: string;
        /** Siblings before this TLV. */
        readonly before: Uint8Array;
        /** Siblings after this TLV. */
        readonly after: Uint8Array;
    }
    /**
     * Decode a single object from Uint8Array.
     * @param input - Input buffer, which should contain the encoded object and nothing else.
     * @param d - Decodable object type.
     * @returns Decoded object.
     *
     * @throws Error
     * Thrown if the input cannot be decoded as the specified object type, or there's junk leftover.
     */
    function decode<R>(input: Uint8Array, d: Decodable<R>): R;
}

/**
 * High level decrypter.
 *
 * @remarks
 * This captures both the decryption key and the wire format of encrypted content.
 */
declare interface Decrypter<T = Data> {
    /**
     * Decrypt a packet.
     * The packet is modified in-place.
     */
    decrypt: (pkt: T) => Promise<void>;
}

declare class DefaultServers {
    private nfw;
    /** Server for ping */
    private pingServer?;
    /** Server for certificates */
    private certServer?;
    constructor(nfw: NFW);
    restart(): void;
    private setupPingServer;
    private setupCertServer;
}

/** Make a Promise that resolves after specified duration. */
declare const delay: <T = void>(after: number, value?: T) => Promise<T>;

/** DataStore interface, delete method. */
declare interface Delete {
    /** Delete Data packets with given names. */
    delete: (...names: readonly Name[]) => Promise<void>;
}

declare class DigestComp implements NamingConvention<Uint8Array>, NamingConvention.WithAltUri {
    protected readonly tt: number;
    private readonly altUriPrefix;
    private readonly altUriRegex;
    constructor(tt: number, altUriPrefix: string);
    match(comp: Component): boolean;
    create(v: Uint8Array): Component;
    parse(comp: Component): Uint8Array;
    toAltUri(comp: Component): string;
    fromAltUri(input: string): Component | undefined;
}

/** Signer and Verifier for SigType.Sha256 digest. */
declare const digestSigning: Signer & Verifier;

declare type EcCurve = keyof typeof PointSizes;

declare namespace EcCurve {
    const Default: EcCurve;
    const Choices: readonly ("P-256" | "P-384" | "P-521")[];
}

/** Sha256WithEcdsa signing algorithm. */
declare const ECDSA: SigningAlgorithm<ECDSA.Info, true, ECDSA.GenParams>;

declare namespace ECDSA {
    /** Key generation parameters. */
    interface GenParams {
        /**
         * EC curve.
         * @defaultValue P-256
         */
        curve?: EcCurve;
        /** Import PKCS#8 private key and SPKI public key instead of generating. */
        importPkcs8?: [pkcs8: Uint8Array, spki: Uint8Array];
    }
    interface Info {
        curve: EcCurve;
    }
}

/** Ed25519 signing algorithm. */
declare const Ed25519: SigningAlgorithm<{}, true, {}>;

declare namespace Ed25519 {
    type GenParams = EdGenParams;
}

/** Key generation parameters. */
declare interface EdGenParams {
    /** Import PKCS#8 private key and SPKI public key instead of generating. */
    importPkcs8?: [pkcs8: Uint8Array, spki: Uint8Array];
}

/**
 * An object acceptable to {@link Encoder.encode}.
 *
 * @remarks
 * - `Uint8Array`: prepended as is.
 * - `undefined` and `false`: skipped.
 * - `EncodableObj`: `.encodeTo(encoder)` is invoked.
 * - `EncodableTlv`: passed to {@link Encoder.prependTlv}.
 * - `Encodable[]`: passed to {@link Encoder.prependValue}.
 */
declare type Encodable = Uint8Array | undefined | false | EncodableObj | EncodableTlv | readonly Encodable[];

/** An object that knows how to prepend itself to an Encoder. */
declare interface EncodableObj {
    encodeTo: (encoder: Encoder) => void;
}

/**
 * An encodable TLV structure.
 *
 * @remarks
 * First item is a number for TLV-TYPE.
 * Optional second item could be {@link Encoder.OmitEmpty} to omit the TLV if TLV-VALUE is empty.
 * Subsequent items are `Encodable`s for TLV-VALUE.
 */
declare type EncodableTlv = [type: number, ...Encodable[]] | [
type: number,
omitEmpty: typeof Encoder.OmitEmpty,
...Encodable[]
];

/** TLV encoder that accepts objects in reverse order. */
declare class Encoder {
    constructor(initSize?: number);
    private buf;
    private off;
    /** Return encoding output size. */
    get size(): number;
    /** Obtain encoding output. */
    get output(): Uint8Array;
    /**
     * Make room to prepend an object.
     * @param sizeofObject - Object size.
     * @returns Room to write object.
     */
    prependRoom(sizeofObject: number): Uint8Array;
    /** Prepend TLV-TYPE and TLV-LENGTH. */
    prependTypeLength(tlvType: number, tlvLength: number): void;
    /**
     * Prepend TLV-VALUE.
     *
     * @remarks
     * Elements are prepended in the reverse order, so that they would appear in the output
     * in the same order as the parameter order.
     */
    prependValue(...tlvValue: Encodable[]): void;
    /**
     * Prepend TLV structure.
     * @see {@link EncodableTlv}
     */
    prependTlv(tlvType: number, ...tlvValue: Encodable[]): void;
    /**
     * Prepend TLV structure, but skip if TLV-VALUE is empty.
     * @see {@link EncodableTlv}
     */
    prependTlv(tlvType: number, omitEmpty: typeof Encoder.OmitEmpty, ...tlvValue: Encodable[]): void;
    /** Prepend `Encodable`. */
    encode(obj: Encodable): void;
    private grow;
}

declare namespace Encoder {
    /**
     * Indicate that TLV should be skipped if TLV-VALUE is empty.
     * @see {@link EncodableTlv}
     */
    const OmitEmpty: unique symbol;
    /** Encode a single object into Uint8Array. */
    function encode(obj: Encodable, initBufSize?: number): Uint8Array;
    /**
     * Extract the encoding output of an element while writing to a parent encoder.
     * @param obj - Encodable element.
     * @param cb - Function to receive the encoding output of `obj`.
     * @returns Wrapped Encodable object.
     */
    function extract(obj: Encodable, cb: (output: Uint8Array) => void): Encodable;
}

/**
 * High level encrypter.
 *
 * @remarks
 * This captures both the encryption key and the wire format of encrypted content.
 */
declare interface Encrypter<T = Data> {
    /**
     * Encrypt a packet.
     * The packet is modified in-place.
     */
    encrypt: (pkt: T) => Promise<void>;
}

/**
 * WebCrypto based encryption algorithm implementation.
 * @typeParam I - Algorithm-specific per-key information.
 * @typeParam Asym - Whether the algorithm is asymmetric.
 * @typeParam G - Key generation parameters.
 */
declare interface EncryptionAlgorithm<I = any, Asym extends boolean = any, G = any> extends CryptoAlgorithm<I, Asym, G> {
    /**
     * Create a low level encryption function from public key (in asymmetric algorithm) or
     * secret key (in symmetric algorithm).
     */
    makeLLEncrypt: If<Asym, (key: CryptoAlgorithm.PublicKey<I>) => LLEncrypt, (key: CryptoAlgorithm.SecretKey<I>) => LLEncrypt, unknown>;
    /**
     * Create a low level decryption function from private key (in asymmetric algorithm) or
     * secret key (in symmetric algorithm).
     */
    makeLLDecrypt: If<Asym, (key: CryptoAlgorithm.PrivateKey<I>) => LLDecrypt, (key: CryptoAlgorithm.SecretKey<I>) => LLDecrypt, unknown>;
}

/**
 * A full list of encryption algorithms.
 *
 * @remarks
 * The *full* list contains all implemented algorithms.
 * This list currently contains {@link AESCBC}, {@link AESCTR}, {@link AESGCM},
 * and {@link RSAOAEP}.
 *
 * This can be used in place of {@link EncryptionAlgorithmListSlim} to support more algorithms,
 * at the cost of larger bundle size. If you know exactly which algorithms are needed, you can
 * also explicitly import them and form an array.
 */
declare const EncryptionAlgorithmListFull: readonly EncryptionAlgorithm[];

/**
 * A slim list of encryption algorithms.
 *
 * @remarks
 * The *slim* list contains only the most commonly used algorithms, to reduce bundle size.
 * This list is currently empty.
 * If you need more algorithms, explicitly import them or use {@link EncryptionAlgorithmListFull}.
 */
declare const EncryptionAlgorithmListSlim: readonly EncryptionAlgorithm[];

declare type EncryptionOptG<I, Asym extends boolean, G> = {} extends G ? [
EncryptionAlgorithm<I, Asym, G>,
G?
] : [
EncryptionAlgorithm<I, Asym, G>,
G
];

/**
 * Endpoint provides basic consumer and producer functionality. It is the main entry point for an
 * application to interact with the logical forwarder.
 */
declare class Endpoint {
    readonly opts: Options_2;
    constructor(opts?: Options_2);
    /** Logical forwarder instance. */
    readonly fw: Forwarder;
    /**
     * Retrieve a single piece of Data.
     * @param interest - Interest or Interest name.
     */
    consume(interest: Interest | NameLike, opts?: ConsumerOptions): ConsumerContext;
    /**
     * Start a producer.
     * @param prefix - Prefix registration; if `undefined`, prefixes may be added later.
     * @param handler - Function to handle incoming Interest.
     */
    produce(prefix: NameLike | undefined, handler: ProducerHandler, opts?: ProducerOptions): Producer;
}

declare namespace Endpoint {
    /** Delete default Forwarder instance (mainly for unit testing). */
    const deleteDefaultForwarder: typeof Forwarder.deleteDefault;
    /** Describe how to derive route announcement from name prefix in {@link Endpoint.produce}. */
    type RouteAnnouncement = FwFace.RouteAnnouncement;
}

declare namespace endpoint {
    export {
        ConsumerContext,
        ConsumerOptions,
        DataBuffer,
        DataStoreBuffer,
        ProducerHandler,
        ProducerOptions,
        Producer,
        RetxOptions,
        RetxGenerator,
        RetxPolicy,
        Options_2 as Options,
        Endpoint
    }
}
export { endpoint }

declare type ErrFlags = "ERROR: can only define flags on a non-repeatable number field";

/**
 * TLV-VALUE decoder that understands Packet Format v0.3 evolvability guidelines.
 * @typeParam T - Target type being decoded.
 */
declare class EvDecoder<T> {
    private readonly typeName;
    private readonly topTT;
    private readonly rules;
    private readonly requiredTT;
    private nextOrder;
    private isCritical;
    private unknownHandler?;
    /** Callbacks before decoding TLV-VALUE. */
    readonly beforeObservers: Array<EvDecoder.TlvObserver<T>>;
    /** Callbacks after decoding TLV-VALUE. */
    readonly afterObservers: Array<EvDecoder.TlvObserver<T>>;
    /**
     * Constructor.
     * @param typeName - type name, used in error messages.
     * @param topTT - If specified, the top-level TLV-TYPE will be checked to be in this list.
     */
    constructor(typeName: string, topTT?: number | readonly number[]);
    applyDefaultsToRuleOptions({ order, required, repeat, }?: EvDecoder.RuleOptions): Required<EvDecoder.RuleOptions>;
    /**
     * Add a decoding rule.
     * @param tt - TLV-TYPE to match this rule.
     * @param cb - Callback or nested EvDecoder to handle element TLV.
     * @param opts - Additional rule options.
     */
    add(tt: number, cb: EvDecoder.ElementDecoder<T> | EvDecoder<T>, opts?: Partial<EvDecoder.RuleOptions>): this;
    /** Set callback to determine whether TLV-TYPE is critical. */
    setIsCritical(cb: EvDecoder.IsCritical): this;
    /** Set callback to handle unknown elements. */
    setUnknown(cb: EvDecoder.UnknownElementHandler<T>): this;
    /** Decode TLV to target object. */
    decode<R extends T = T>(target: R, decoder: Decoder): R;
    /** Decode TLV-VALUE to target object. */
    decodeValue<R extends T = T>(target: R, vd: Decoder): R;
    private decodeV;
    private handleUnrecognized;
}

declare namespace EvDecoder {
    /** Invoked when a matching TLV element is found. */
    type ElementDecoder<T> = (target: T, tlv: Decoder.Tlv) => void;
    interface RuleOptions {
        /**
         * Expected order of appearance.
         *
         * @remarks
         * When using this option, it should be specified for all rules in a EvDecoder.
         *
         * @defaultValue
         * The order in which rules were added to EvDecoder.
         */
        order?: number;
        /**
         * Whether TLV element must appear at least once.
         * @defaultValue `false`
         */
        required?: boolean;
        /**
         * Whether TLV element may appear more than once.
         * @defaultValue `false`
         */
        repeat?: boolean;
    }
    /**
     * Invoked when a TLV element does not match any rule.
     * @param order - Order number of the last recognized TLV element.
     * @returns `true` if this TLV element is accepted; `false` to follow evolvability guidelines.
     */
    type UnknownElementHandler<T> = (target: T, tlv: Decoder.Tlv, order: number) => boolean;
    /**
     * Function to determine whether a TLV-TYPE number is "critical".
     * Unrecognized or out-of-order TLV element with a critical TLV-TYPE number causes decoding error.
     */
    type IsCritical = (tt: number) => boolean;
    /**
     * IsCritical callback that always returns `false`.
     * Any unrecognized or out-of-order TLV elements would be ignored.
     */
    const neverCritical: IsCritical;
    /**
     * IsCritical callback that always returns `true`.
     * Any unrecognized or out-of-order TLV elements would cause an error.
     */
    const alwaysCritical: IsCritical;
    /**
     * Callback before or after decoding TLV-VALUE.
     * @param target - Target object.
     * @param topTlv - Top-level TLV element, available in EVD.decode but unavailable in EVD.decodeValue.
     */
    type TlvObserver<T> = (target: T, topTlv?: Decoder.Tlv) => void;
}

/**
 * Use in components with the `@Output` directive to emit custom events
 * synchronously or asynchronously, and register handlers for those events
 * by subscribing to an instance.
 *
 * @usageNotes
 *
 * Extends
 * [RxJS `Subject`](https://rxjs.dev/api/index/class/Subject)
 * for Angular by adding the `emit()` method.
 *
 * In the following example, a component defines two output properties
 * that create event emitters. When the title is clicked, the emitter
 * emits an open or close event to toggle the current visibility state.
 *
 * ```html
 * @Component({
 *   selector: 'zippy',
 *   template: `
 *   <div class="zippy">
 *     <div (click)="toggle()">Toggle</div>
 *     <div [hidden]="!visible">
 *       <ng-content></ng-content>
 *     </div>
 *  </div>`})
 * export class Zippy {
 *   visible: boolean = true;
 *   @Output() open: EventEmitter<any> = new EventEmitter();
 *   @Output() close: EventEmitter<any> = new EventEmitter();
 *
 *   toggle() {
 *     this.visible = !this.visible;
 *     if (this.visible) {
 *       this.open.emit(null);
 *     } else {
 *       this.close.emit(null);
 *     }
 *   }
 * }
 * ```
 *
 * Access the event object with the `$event` argument passed to the output event
 * handler:
 *
 * ```html
 * <zippy (open)="onOpen($event)" (close)="onClose($event)"></zippy>
 * ```
 *
 * @see [Observables in Angular](guide/observables-in-angular)
 * @publicApi
 */
declare interface EventEmitter<T> extends Subject<T> {
    /**
     * Creates an instance of this class that can
     * deliver events synchronously or asynchronously.
     *
     * @param [isAsync=false] When true, deliver events asynchronously.
     *
     */
    new (isAsync?: boolean): EventEmitter<T>;
    /**
     * Emits an event containing a given value.
     * @param value The value to emit.
     */
    emit(value?: T): void;
    /**
     * Registers handlers for events emitted by this instance.
     * @param next When supplied, a custom handler for emitted events.
     * @param error When supplied, a custom handler for an error notification from this emitter.
     * @param complete When supplied, a custom handler for a completion notification from this
     *     emitter.
     */
    subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): Subscription_2;
    /**
     * Registers handlers for events emitted by this instance.
     * @param observerOrNext When supplied, a custom handler for emitted events, or an observer
     *     object.
     * @param error When supplied, a custom handler for an error notification from this emitter.
     * @param complete When supplied, a custom handler for a completion notification from this
     *     emitter.
     */
    subscribe(observerOrNext?: any, error?: any, complete?: any): Subscription_2;
}

/**
 * @publicApi
 */
declare const EventEmitter: {
    new (isAsync?: boolean): EventEmitter<any>;
    new <T>(isAsync?: boolean): EventEmitter<T>;
    readonly prototype: EventEmitter<any>;
};

declare type EventMap = SyncProtocol.EventMap<Name> & {
    debug: CustomEvent<DebugEntry>;
};

declare type EventMap_2 = {
    /** Emitted upon face is up as reported by lower layer. */
    up: Event;
    /** Emitted upon face is down as reported by lower layer. */
    down: Event;
    /** Emitted upon face is closed. */
    close: Event;
};

declare type EventMap_3 = {
    /** Emitted before adding face. */
    faceadd: Forwarder.FaceEvent;
    /** Emitted after removing face. */
    facerm: Forwarder.FaceEvent;
    /** Emitted before adding prefix to face. */
    prefixadd: Forwarder.PrefixEvent;
    /** Emitted after removing prefix from face. */
    prefixrm: Forwarder.PrefixEvent;
    /** Emitted before advertising prefix. */
    annadd: Forwarder.AnnouncementEvent;
    /** Emitted before withdrawing prefix. */
    annrm: Forwarder.AnnouncementEvent;
    /** Emitted after packet arrival. */
    pktrx: Forwarder.PacketEvent;
    /** Emitted before packet transmission. */
    pkttx: Forwarder.PacketEvent;
};

declare type EventMap_4 = SyncProtocol.EventMap<Name> & {
    debug: CustomEvent<DebugEntry_2>;
};

declare type EventMap_5 = {
    /** Emitted for debugging. */
    debug: CustomEvent<DebugEntry_3>;
    state: PartialSubscriber.StateEvent;
};

declare type EventMap_6 = {
    debug: CustomEvent<DebugEntry_4>;
};

declare type EventMap_7 = SyncProtocol.EventMap<Name> & {
    debug: CustomEvent<DebugEntry_5>;
};

declare type EventMap_8 = {
    error: CustomEvent<Error>;
};

declare type EventMap_9 = {
    /** Emitted upon face state change. */
    state: L3Face.StateEvent;
    /** Emitted upon state becomes UP. */
    up: Event;
    /** Emitted upon state becomes DOWN. */
    down: CustomEvent<Error>;
    /** Emitted upon state becomes CLOSED. */
    close: Event;
    /** Emitted upon RX decoding error. */
    rxerror: CustomEvent<L3Face.RxError>;
    /** Emitted upon TX preparation error. */
    txerror: CustomEvent<L3Face.TxError>;
};

/** Delete keys from a Set or Map until its size is below capacity. */
declare function evict<K>(capacity: number, ct: evict.Container<K>): void;

declare namespace evict {
    type Container<K> = Pick<Set<K> & Map<K, unknown>, "delete" | "size" | "keys">;
}

/**
 Create a type from an object type without certain keys.

 We recommend setting the `requireExactProps` option to `true`.

 This type is a stricter version of [`Omit`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-5.html#the-omit-helper-type). The `Omit` type does not restrict the omitted keys to be keys present on the given type, while `Except` does. The benefits of a stricter type are avoiding typos and allowing the compiler to pick up on rename refactors automatically.

 This type was proposed to the TypeScript team, which declined it, saying they prefer that libraries implement stricter versions of the built-in types ([microsoft/TypeScript#30825](https://github.com/microsoft/TypeScript/issues/30825#issuecomment-523668235)).

 @example
 ```
 import type {Except} from 'type-fest';

 type Foo = {
 	a: number;
 	b: string;
 };

 type FooWithoutA = Except<Foo, 'a'>;
 //=> {b: string}

 const fooWithoutA: FooWithoutA = {a: 1, b: '2'};
 //=> errors: 'a' does not exist in type '{ b: string; }'

 type FooWithoutB = Except<Foo, 'b', {requireExactProps: true}>;
 //=> {a: number} & Partial<Record<"b", never>>

 const fooWithoutB: FooWithoutB = {a: 1, b: '2'};
 //=> errors at 'b': Type 'string' is not assignable to type 'undefined'.
 ```

 @category Object
 */
declare type Except<ObjectType, KeysType extends keyof ObjectType, Options extends ExceptOptions = {requireExactProps: false}> = {
    	[KeyType in keyof ObjectType as Filter<KeyType, KeysType>]: ObjectType[KeyType];
} & (Options['requireExactProps'] extends true
	? Partial<Record<KeysType, never>>
	: {});

declare type ExceptOptions = {
    	/**
     	Disallow assigning non-specified properties.

     	Note that any omitted properties in the resulting type will be present in autocomplete as `undefined`.

     	@default false
     	*/
    	requireExactProps?: boolean;
};

export declare namespace ext {
    const ndnTypes: {
        packet: typeof packet;
        tlv: typeof tlv;
        sync: typeof sync;
        keychain: typeof keychain;
        util: typeof util;
        ws_transport: typeof ws_transport;
        endpoint: typeof endpoint;
    };
    const node: INode;
    /**
     * Visualize a NDN TLV block or packet
     * @param packet can be hex or base64 string, binary buffer or an encodable e.g. Interest
     */
    export function visualize(packet: string | Uint8Array | ArrayBuffer | tlv.Encodable | undefined): void;
    /**
     * Filter packets to be captured
     * @param filter filter: function to check if captured packet should be stored
     */
    export function setGlobalCaptureFilter(filter: (packet: ICapturedPacket) => boolean): void;
    /**
     * Load a local file from the user's computer
     */
    export function loadfile(): Promise<ArrayBuffer>;
    /**
     * Download a file to user's computer
     * @param bin Buffer to be downloaded
     * @param type MIME type of the file to be downloaded
     * @param name Name of the file to be downloaded
     * @param deflate Compress the buffer using pako DEFLATE
     */
    export function downloadfile(bin: Uint8Array, type: string, name: string, deflate?: boolean): void;
    /**
     * The WebAssembly filesystem.
     * @details Allows access to the virtual filesystem.
     * Note: this module exists only after the first call
     * to a WASM module has been done and the filesystem has been
     * initialized. The /data directory is the working directory
     * and is the only directory that is shared across all modules.
     */
    const FS: WasmFS;
    /**
     * The DCT tools module.
     */
    const DCT: DCT;
}

/** An TLV element that allows extension sub element. */
declare interface Extensible {
    readonly [Extensible.TAG]: ExtensionRegistry<any>;
}

declare namespace Extensible {
    const TAG: unique symbol;
    /** Clone extension fields of src to dst. */
    function cloneRecord(dst: Extensible, src: Extensible): void;
    /**
     * Define simple getters and setters.
     * @param typ - Extensible subclass constructor.
     * @param exts - Extensions, each key is a property name and each value is the TLV-TYPE number.
     */
    function defineGettersSetters<T extends Extensible>(typ: new () => T, exts: Record<string, number>): void;
}

/**
 * An extension sub element on a parent TLV element.
 * @typeParam T - Parent TLV element type.
 * @typeParam R - Value type of this extension.
 */
declare interface Extension<T, R = unknown> {
    /** TLV-TYPE. */
    readonly tt: number;
    /** Order relative to other extensions, used on encoding only. */
    readonly order?: number;
    /**
     * Decode extension element.
     * @param obj - Parent object.
     * @param tlv - TLV of sub element; its TLV-TYPE would be `this.tt`.
     * @param accumulator - Previous decoded value, if extension element appears more than once.
     */
    decode: (obj: T, tlv: Decoder.Tlv, accumulator?: R) => R;
    /**
     * Encode extension element.
     * @param obj - Parent object.
     * @param value - Decoded value.
     * @returns Encoding of sub element; its TLV-TYPE should be `this.tt`.
     */
    encode: (obj: T, value: R) => Encodable;
}

declare namespace Extension {
    /** Retrieve value of an extension field. */
    function get(obj: Extensible, tt: number): unknown;
    /** Assign value of an extension field. */
    function set(obj: Extensible, tt: number, value: unknown): void;
    /** Clear value of an extension field. */
    function clear(obj: Extensible, tt: number): void;
}

declare type ExtensionFieldType<R> = Pick<StructFieldType<R>, "encode" | "decode">;

declare interface ExtensionOptions {
    order?: number;
}

/** Registry of known extension fields of a parent TLV element. */
declare class ExtensionRegistry<T extends Extensible> {
    private readonly table;
    /** Add an extension. */
    readonly register: <R>(tt: number, type: ExtensionFieldType<R>, { order }?: ExtensionOptions) => void;
    /** Add an extension. */
    readonly registerExtension: <R>(ext: Extension<T, R>) => void;
    /** Remove an extension. */
    readonly unregisterExtension: (tt: number) => void;
    /** UnknownElementCallback for EvDecoder. */
    readonly decodeUnknown: EvDecoder.UnknownElementHandler<T>;
    /** Encode extension fields. */
    encode(source: T): Encodable[];
}

declare const FIELDS: unique symbol;

declare class Fields {
    constructor(...args: Array<Data | Data.CtorArg>);
    name: Name;
    get contentType(): number;
    set contentType(v: number);
    private contentType_;
    get freshnessPeriod(): number;
    set freshnessPeriod(v: number);
    private freshnessPeriod_;
    finalBlockId?: Component;
    /** Determine whether FinalBlockId equals the last name component. */
    get isFinalBlock(): boolean;
    /**
     * Setting to `false` deletes FinalBlockId.
     * Setting to `true` assigns FinalBlockId to be the last name component.
     *
     * @throws Error
     * Thrown if attempting to set `true` while the name is empty.
     */
    set isFinalBlock(v: boolean);
    content: Uint8Array;
    sigInfo: SigInfo;
    sigValue: Uint8Array;
    signedPortion?: Uint8Array;
    topTlv?: Uint8Array;
    topTlvDigest?: Uint8Array;
}

declare class Fields_2 {
    constructor(...args: Array<Interest | Interest.CtorArg>);
    name: Name;
    canBePrefix: boolean;
    mustBeFresh: boolean;
    fwHint?: FwHint;
    get nonce(): number | undefined;
    set nonce(v: number | undefined);
    private nonce_;
    get lifetime(): number;
    set lifetime(v: number);
    private lifetime_;
    get hopLimit(): number;
    set hopLimit(v: number);
    private hopLimit_;
    appParameters?: Uint8Array;
    sigInfo?: SigInfo;
    sigValue: Uint8Array;
    paramsPortion?: Uint8Array;
    signedPortion?: Uint8Array;
}

/**
 Filter out keys from an object.

 Returns `never` if `Exclude` is strictly equal to `Key`.
 Returns `never` if `Key` extends `Exclude`.
 Returns `Key` otherwise.

 @example
 ```
 type Filtered = Filter<'foo', 'foo'>;
 //=> never
 ```

 @example
 ```
 type Filtered = Filter<'bar', string>;
 //=> never
 ```

 @example
 ```
 type Filtered = Filter<'bar', 'foo'>;
 //=> 'bar'
 ```

 @see {Except}
 */
declare type Filter<KeyType, ExcludeType> = IsEqual<KeyType, ExcludeType> extends true ? never : (KeyType extends ExcludeType ? never : KeyType);

/** DataStore interface, find method. */
declare interface Find {
    /** Find Data that satisfies Interest. */
    find: (interest: Interest) => Promise<Data | undefined>;
}

/**
 * Perform flatMap on an (async) iterable, but flatten at most once.
 * @remarks
 * flatMap of streaming-iterables recursively flattens the result.
 * This function flattens at most once.
 */
declare function flatMapOnce<T, R>(f: (item: T) => AnyIterable<R>, iterable: AnyIterable<T>): AsyncIterable<R>;

/** Logical forwarder. */
declare interface Forwarder extends TypedEventTarget<EventMap_3> {
    /** Node names, used in forwarding hint processing. */
    readonly nodeNames: Name[];
    /** Logical faces. */
    readonly faces: ReadonlySet<FwFace>;
    /** Add a logical face to the logical forwarder. */
    addFace: (face: FwFace.RxTx | FwFace.RxTxDuplex, attributes?: FwFace.Attributes) => FwFace;
    /**
     * Cancel timers and other I/O resources.
     * This instance should not be used after this operation.
     */
    close: () => void;
}

declare namespace Forwarder {
    /** {@link Forwarder.create} options. */
    interface Options {
        /** Whether to try matching Data without PIT token. */
        dataNoTokenMatch?: boolean;
    }
    const DefaultOptions: Required<Options>;
    /** Create a new logical forwarder. */
    function create(options?: Options): Forwarder;
    /** Access the default logical forwarder instance. */
    function getDefault(): Forwarder;
    /** Replace the default logical forwarder instance. */
    function replaceDefault(fw?: Forwarder): void;
    /** Close and delete the default logical forwarder instance (mainly for unit testing). */
    function deleteDefault(): void;
    /** Face event. */
    class FaceEvent extends Event {
        readonly face: FwFace;
        constructor(type: string, face: FwFace);
    }
    /** Prefix registration event. */
    class PrefixEvent extends Event {
        readonly face: FwFace;
        readonly prefix: Name;
        constructor(type: string, face: FwFace, prefix: Name);
    }
    /** Prefix announcement event. */
    class AnnouncementEvent extends Event {
        readonly name: Name;
        constructor(type: string, name: Name);
    }
    /** Packet event. */
    class PacketEvent extends Event {
        readonly face: FwFace;
        readonly packet: FwPacket;
        constructor(type: string, face: FwFace, packet: FwPacket);
    }
}

declare interface ForwardingProvider {
    topo: Topology;
    pendingUpdatesNodes: {
        [id: string]: Partial<INode>;
    };
    pendingUpdatesEdges: {
        [id: string]: Partial<IEdge>;
    };
    defaultLatency: number;
    defaultLoss: number;
    contentStoreSize?: number;
    latencySlowdown?: number;
    initialize: () => Promise<void>;
    initializePostNetwork: () => Promise<void>;
    edgeUpdated: (edge?: IEdge) => Promise<void>;
    nodeUpdated: (node?: INode) => Promise<void>;
    onNetworkClick: () => Promise<void>;
    refreshFib?: () => Promise<void>;
    sendPingInterest?: (from: INode, to: INode) => void;
    sendInterest?: (name: string, node: INode) => void;
    fetchCapturedPackets?: (node: INode) => void;
    visualizeCaptured?: (packet: ICapturedPacket, node: INode) => void;
    downloadExperimentDump?: () => void;
    loadExperimentDump?: () => Promise<void>;
    runCode?: (code: string, node: INode) => void;
    openTerminal?: (node: INode) => void;
}

declare const FROM: unique symbol;

/**
 * Convert hexadecimal string to byte array.
 * @param s - Input hexadecimal string (case insensitive).
 *
 * @remarks
 * The input is expected to be valid hexadecimal string.
 * If the input is invalid, the output would be wrong, but no error would be thrown.
 */
declare function fromHex(s: string): Uint8Array;

declare namespace fromHex {
    /** Conversion table from hexadecimal digit (case insensitive) to nibble. */
    const TABLE: Readonly<Record<string, number>>;
}

/** Convert UTF-8 byte array to string. */
declare function fromUtf8(buf: Uint8Array): string;

/** PSync - FullSync participant. */
declare class FullSync extends TypedEventTarget<EventMap> implements SyncProtocol<Name> {
    constructor({ p, endpoint, describe, syncPrefix, syncReplyFreshness, signer, producerBufferLimit, syncInterestLifetime, syncInterestInterval, verifier, }: FullSync.Options);
    private readonly maybeHaveEventListener;
    private readonly endpoint;
    readonly describe: string;
    private readonly syncPrefix;
    private readonly c;
    private readonly codec;
    private closed;
    private readonly pFreshness;
    private readonly pBuffer;
    private readonly pProducer;
    private readonly pPendings;
    private readonly cFetcher;
    private readonly cInterval;
    private cTimer;
    private cAbort?;
    private cCurrentInterestName?;
    private debug;
    /** Stop the protocol operation. */
    close(): void;
    get(prefix: Name): SyncNode<Name> | undefined;
    add(prefix: Name): SyncNode<Name>;
    private handleSyncInterest;
    private handleIncreaseSeqNum;
    private sendSyncData;
    private scheduleSyncInterest;
    private sendSyncInterest;
}

declare namespace FullSync {
    interface Parameters extends PSyncCore.Parameters, PSyncCodec.Parameters {
    }
    interface Options {
        /**
         * Algorithm parameters.
         *
         * @remarks
         * They must be the same on every peer.
         */
        p: Parameters;
        /**
         * Endpoint for communication.
         * @defaultValue
         * Endpoint on default logical forwarder.
         */
        endpoint?: Endpoint;
        /** Description for debugging purpose. */
        describe?: string;
        /** Sync group prefix. */
        syncPrefix: Name;
        /**
         * FreshnessPeriod of sync reply Data packet.
         * @defaultValue 1000
         */
        syncReplyFreshness?: number;
        /**
         * Signer of sync reply Data packets.
         * @defaultValue digestSigning
         */
        signer?: Signer;
        /**
         * How many sync reply segmented objects to keep in buffer.
         * This must be a positive integer.
         * @defaultValue 32
         */
        producerBufferLimit?: number;
        /**
         * Sync Interest lifetime in milliseconds.
         * @defaultValue 1000
         */
        syncInterestLifetime?: number;
        /**
         * Interval between sync Interests, randomized within the range, in milliseconds.
         * @defaultValue `[syncInterestLifetime/2+100,syncInterestLifetime/2+500]`
         */
        syncInterestInterval?: IntervalRange;
        /**
         * Verifier of sync reply Data packets.
         * @defaultValue no verification
         */
        verifier?: Verifier;
    }
}

/** A socket or network interface associated with logical forwarder. */
declare interface FwFace extends TypedEventTarget<EventMap_2> {
    readonly fw: Forwarder;
    readonly attributes: FwFace.Attributes;
    readonly running: boolean;
    /** Shutdown the face. */
    close: () => void;
    toString: () => string;
    /** Determine if a route is present on the face. */
    hasRoute: (name: NameLike) => boolean;
    /**
     * Add a route toward the face.
     * @param name - Route name.
     * @param announcement - Prefix announcement name or how to derive it from `name`.
     *
     * @remarks
     * When the logical forwarder receives an Interest matching `name`, it may forward the Interest
     * to this face. Unless `announcement` is set to `false`, this also invokes
     * {@link addAnnouncement} to readvertise the name prefix to remote forwarders.
     */
    addRoute: (name: NameLike, announcement?: FwFace.RouteAnnouncement) => void;
    /** Remove a route toward the face. */
    removeRoute: (name: NameLike, announcement?: FwFace.RouteAnnouncement) => void;
    /**
     * Add a prefix announcement associated with the face.
     * @param name - Prefix announcement name.
     *
     * @remarks
     * The announcement is passed to {@link ReadvertiseDestination}s (e.g. NFD prefix registration
     * client) on the logical forwarder, so that remote forwarders would send Interests matching
     * the prefix to the local logical forwarder.
     *
     * Multiple FwFaces could make the same announcement. When the last FwFace making an announcement
     * is closed, the announcement is withdrawn from {@link ReadvertiseDestination}s.
     *
     * This function has no effect if `FwFace.Attributes.advertiseFrom` is set to `false`.
     */
    addAnnouncement: (name: NameLike) => void;
    /** Remove a prefix announcement associated with the face. */
    removeAnnouncement: (name: NameLike) => void;
}

declare namespace FwFace {
    /** Attributes of a logical forwarder face. */
    interface Attributes extends Record<string, unknown> {
        /** Short string to identify the face. */
        describe?: string;
        /**
         * Whether face is local.
         * @defaultValue false
         */
        local?: boolean;
        /**
         * Whether to allow prefix announcements.
         * @defaultValue true
         * @remarks
         * If `false`, {@link FwFace.addAnnouncement} has no effect.
         */
        advertiseFrom?: boolean;
        /**
         * Whether routes registered on this face would cause FIB to stop matching onto shorter prefixes.
         * @defaultValue true
         * @see {@link \@ndn/endpoint!ProducerOptions.routeCapture}
         */
        routeCapture?: boolean;
        [k: string]: unknown;
    }
    /**
     * Describe how to derive route announcement from name prefix in {@link FwFace.addRoute}.
     *
     * @remarks
     * - `false`: no announcement is made.
     * - `true`: same as route name.
     * - number: n-component prefix of route name.
     * - {@link Name} or string: specified name.
     */
    type RouteAnnouncement = boolean | number | NameLike;
    type RxTxEventMap = Pick<EventMap_2, "up" | "down">;
    interface RxTxBase {
        readonly attributes?: Attributes;
        addEventListener?: <K extends keyof RxTxEventMap>(type: K, listener: (ev: RxTxEventMap[K]) => any, options?: AddEventListenerOptions) => void;
        removeEventListener?: <K extends keyof RxTxEventMap>(type: K, listener: (ev: RxTxEventMap[K]) => any, options?: EventListenerOptions) => void;
    }
    /** A logical face with separate RX and TX packet streams. */
    interface RxTx extends RxTxBase {
        /** RX packet stream received by the logical forwarder. */
        rx: AsyncIterable<FwPacket>;
        /** Function to accept TX packet stream sent by the logical forwarder. */
        tx: (iterable: AsyncIterable<FwPacket>) => void;
    }
    /** A logical face with duplex RX and TX packet streams. */
    interface RxTxDuplex extends RxTxBase {
        /**
         * Duplex RX and TX streams.
         * @param iterable - TX packet stream sent by the logical forwarder.
         * @returns RX packet stream received by the logical forwarder.
         */
        duplex: (iterable: AsyncIterable<FwPacket>) => AsyncIterable<FwPacket>;
    }
}

/** ForwardingHint in Interest. */
declare class FwHint {
    static decodeValue(vd: Decoder): FwHint;
    constructor(copy?: FwHint);
    constructor(name: NameLike);
    constructor(delegations: readonly NameLike[]);
    delegations: Name[];
    encodeTo(encoder: Encoder): void;
}

/** A logical packet in the logical forwarder. */
declare interface FwPacket<T extends L3Pkt = L3Pkt> {
    l3: T;
    token?: unknown;
    congestionMark?: number;
    reject?: RejectInterest.Reason;
    cancel?: boolean;
}

declare namespace FwPacket {
    function create<T extends L3Pkt>(l3: T, token?: unknown, congestionMark?: number): FwPacket<T>;
    /** Determine whether this is a plain packet that can be sent on the wire. */
    function isEncodable({ reject, cancel }: FwPacket): boolean;
}

/**
 * Generate a pair of encrypter and decrypter.
 * @param name - Key name (used as-is) or subject name (forming key name with random *KeyId*).
 * @param a - Encryption algorithm and key generation options.
 */
declare function generateEncryptionKey<I, Asym extends boolean, G>(name: NameLike, ...a: EncryptionOptG<I, Asym, G>): Promise<[NamedEncrypter<Asym>, NamedDecrypter<Asym>]>;

/**
 * Generate a pair of encrypter and decrypter, and save to KeyChain.
 * @param keyChain - Target KeyChain.
 * @param name - Key name (used as-is) or subject name (forming key name with random *KeyId*).
 * @param a - Encryption algorithm and key generation options.
 */
declare function generateEncryptionKey<I, Asym extends boolean, G>(keyChain: KeyChain, name: NameLike, ...a: EncryptionOptG<I, Asym, G>): Promise<[NamedEncrypter<Asym>, NamedDecrypter<Asym>]>;

/**
 * Generate a pair of signer and verifier with the default ECDSA signing algorithm.
 * @param name - Key name (used as-is) or subject name (forming key name with random *KeyId*).
 */
declare function generateSigningKey(name: NameLike): Promise<[NamedSigner.PrivateKey, NamedVerifier.PublicKey]>;

/**
 * Generate a pair of signer and verifier with the default ECDSA signing algorithm, and save to KeyChain.
 * @param keyChain - Target KeyChain.
 * @param name - Key name (used as-is) or subject name (forming key name with random *KeyId*).
 */
declare function generateSigningKey(keyChain: KeyChain, name: NameLike): Promise<[NamedSigner.PrivateKey, NamedVerifier.PublicKey]>;

/**
 * Generate a pair of signer and verifier.
 * @param name - Key name (used as-is) or subject name (forming key name with random *KeyId*).
 * @param a - Signing algorithm and key generation options.
 */
declare function generateSigningKey<I, Asym extends boolean, G>(name: NameLike, ...a: SigningOptG<I, Asym, G>): Promise<[NamedSigner<Asym>, NamedVerifier<Asym>]>;

/**
 * Generate a pair of signer and verifier, and save to KeyChain.
 * @param keyChain - Target KeyChain.
 * @param name - Key name (used as-is) or subject name (forming key name with random *KeyId*).
 * @param a - Signing algorithm and key generation options.
 */
declare function generateSigningKey<I, Asym extends boolean, G>(keyChain: KeyChain, name: NameLike, ...a: SigningOptG<I, Asym, G>): Promise<[NamedSigner<Asym>, NamedVerifier<Asym>]>;

/** DataStore interface, get method. */
declare interface Get {
    /** Retrieve Data by exact name. */
    get: (name: Name) => Promise<Data | undefined>;
}

/** 32-bit hash function. */
declare type HashFunction = (seed: number, input: Uint8Array) => number;

/** HmacWithSha256 signing algorithm. */
declare const HMAC: SigningAlgorithm<{}, false, HMAC.GenParams>;

declare namespace HMAC {
    /** Key generation parameters. */
    interface GenParams {
        /** Import raw key bits instead of generating. */
        importRaw?: Uint8Array;
    }
}

/** Invertible Bloom Lookup Table. */
declare class IBLT {
    constructor(p: IBLT.Parameters | IBLT.PreparedParameters);
    private readonly p;
    private readonly ht;
    private readonly key;
    /** Insert a key. */
    insert(key: number): void;
    /** Erase a key. */
    erase(key: number): void;
    private update;
    private update2;
    /** Compute the difference between this (first) and other (second) IBLT. */
    diff(...others: IBLT[]): IBLT.Diff;
    /**
     * Serialize the hashtable to a byte array.
     *
     * @remarks
     * Each entry is serialized as 12 octets:
     * - count: int32
     * - keySum: uint32
     * - keyCheck: uint32
     * IBLT.Parameters.serializeLittleEndian determines endianness.
     *
     * Return value shares the underlying memory. It must be copied when not using compression.
     */
    serialize(): Uint8Array;
    /**
     * Deserialize from a byte array.
     * @throws Error
     * Thrown if input does not match parameters.
     */
    deserialize(v: Uint8Array): void;
    /** Clone to another IBLT. */
    clone(): IBLT;
}

declare namespace IBLT {
    type HashFunction = (seed: number, input: Uint8Array) => number;
    /** IBLT parameters. */
    interface Parameters {
        /** Whether to use little endian when converting uint32 key to Uint8Array. */
        keyToBufferLittleEndian: boolean;
        /** Whether to use little endian when serializing uint32 and int32 fields. */
        serializeLittleEndian: boolean;
        /** 32-bit hash function. */
        hash: HashFunction;
        /** Number of hash keys. */
        nHash: number;
        /**
         * Hash function seed for KeyCheck field.
         *
         * @remarks
         * This must be greater than nHash.
         */
        checkSeed: number;
        /**
         * Number of hashtable entries.
         *
         * @remarks
         * This must be divisible by `nHash`.
         */
        nEntries: number;
    }
    /** Normalized and validated parameters. */
    class PreparedParameters implements Readonly<Parameters> {
        static prepare(p: Parameters): PreparedParameters;
        private constructor();
        readonly nBuckets: number;
    }
    interface PreparedParameters extends Readonly<Parameters> {
    }
    /** Difference between two IBLTs. */
    interface Diff {
        /** Whether all keys have been extracted. */
        success: boolean;
        /** Keys present in the first IBLT but absent in the second IBLT. */
        positive: Set<number>;
        /** Keys absent in the first IBLT but present in the second IBLT. */
        negative: Set<number>;
        /** Total number of keys in positive and negative sets. */
        total: number;
    }
}

declare class IbltCodec {
    readonly ibltCompression: Compression;
    protected readonly ibltParams: IBLT.PreparedParameters;
    iblt2comp(iblt: IBLT): Component;
    comp2iblt(comp: Component): IBLT;
}

declare type ICapturedPacket = [
/** Internal flags */
flags: number,
/** Frame number */
frame_number: number,
/** Timestamp in ms */
timestamp: number,
/** Length of packet in bytes */
length: number,
/** Interest/Data/Nack */
type: string,
/** NDN name of packet */
name: string,
/** Originating node */
from: string | undefined,
/** Destination node */
to?: string | undefined,
/** Contents of the packet for visualization */
p?: Uint8Array | undefined
];

declare interface IEdge extends Edge {
    /** Latency in milliseconds */
    latency: number;
    /** Loss in percentage */
    loss: number;
    /** Extra data object */
    extra: ILinkExtra;
}

declare type If<Cond, True, False, Unknown = True | False> = Cond extends true ? True : Cond extends false ? False : Unknown;

/**
 An if-else-like type that resolves depending on whether the given type is `never`.

 @see {@link IsNever}

 @example
 ```
 import type {IfNever} from 'type-fest';

 type ShouldBeTrue = IfNever<never>;
 //=> true

 type ShouldBeBar = IfNever<'not never', 'foo', 'bar'>;
 //=> 'bar'
 ```

 @category Type Guard
 @category Utilities
 */
declare type IfNever<T, TypeIfNever = true, TypeIfNotNever = false> = (
	IsNever<T> extends true ? TypeIfNever : TypeIfNotNever
);

declare interface ILinkExtra {
    /** Units of traffic pending on this link */
    pendingTraffic: number;
}

/** ImplicitSha256DigestComponent. */
declare const ImplicitDigest: ImplicitDigestComp;

declare class ImplicitDigestComp extends DigestComp {
    /** Remove ImplicitDigest if present at last component. */
    strip(name: Name): Name;
}

/** Certificate import options for {@link createVerifier} and {@link createDecrypter}. */
declare interface ImportCertOptions<A extends CryptoAlgorithm> {
    /**
     * List of recognized algorithms.
     * @defaultValue SigningAlgorithmListSlim or EncryptionAlgorithmListSlim
     *
     * @remarks
     * {@link SigningAlgorithmListSlim} and {@link EncryptionAlgorithmListSlim} only contain a subset
     * of available signing and encryption algorithms. Use {@link SigningAlgorithmListFull} and
     * {@link EncryptionAlgorithmListFull} for all algorithms, at the cost of larger bundle size.
     */
    algoList?: readonly A[];
    /**
     * Whether to check certificate ValidityPeriod.
     * If `true`, throws an error if `.now` is not within ValidityPeriod.
     * @defaultValue true
     */
    checkValidity?: boolean;
    /**
     * Current timestamp for checking ValidityPeriod.
     * @defaultValue `Date.now()`
     */
    now?: ValidityPeriod.TimestampInput;
}

declare interface INode extends Node_2 {
    nfw?: NFW;
    /** Extra data object */
    extra: INodeExtra;
    /** Label of this node */
    label: string;
    /** Set if this node is a passive switch */
    isSwitch?: boolean;
}

declare interface INodeExtra {
    /** Units of traffic pending on this node */
    pendingTraffic: number;
    /** Currently written code on this node */
    codeEdit: string;
    /** Prefixes prodcued by this node */
    producedPrefixes: string[];
    /** FIB or status information of the node */
    fibStr: string;
    /** Wireshark */
    capturedPackets: ICapturedPacket[];
    /** Replay position */
    replayWindow?: number;
    /** Replay position (first) */
    replayWindowF?: number;
    /** Color of node */
    color?: string;
}

/** DataStore interface, insert method. */
declare interface Insert<Options extends {} = {}> {
    /**
     * Insert one or more Data packets.
     *
     * @remarks
     * Arguments include:
     * - an optional Options object
     * - zero or more Data, Iterable<Data>, or AsyncIterable<Data>
     */
    insert: (...args: Insert.Args<Options>) => Promise<void>;
}

declare namespace Insert {
    type Args<O extends {}> = [...(object extends O ? [O] | [] : []), ...ReadonlyArray<Data | AnyIterable<Data>>];
    interface ParsedArgs<O> {
        readonly opts?: O;
        readonly pkts: AsyncIterable<Data>;
        readonly singles: Data[];
        readonly batches: Array<AnyIterable<Data>>;
    }
    /** Normalize {@link Insert.insert} arguments. */
    function parseArgs<O extends {}>(args: Args<O>): ParsedArgs<O>;
}

/** Interest packet. */
declare class Interest implements LLSign.Signable, LLVerify.Verifiable, Signer.Signable, Verifier.Verifiable {
    /**
     * Construct from flexible arguments.
     *
     * Arguments can include, in any order:
     * - {@link Interest} to copy from
     * - {@link Name} or name URI
     * - {@link Interest.CanBePrefix}
     * - {@link Interest.MustBeFresh}
     * - {@link FwHint}
     * - {@link Interest.Nonce}`(v)`
     * - {@link Interest.Lifetime}`(v)`
     * - {@link Interest.HopLimit}`(v)`
     * - `Uint8Array` as AppParameters
     */
    constructor(...args: Array<Interest | Interest.CtorArg>);
    readonly [FIELDS]: Fields_2;
    static decodeFrom(decoder: Decoder): Interest;
    encodeTo(encoder: Encoder): void;
    private encodeParamsPortion;
    private appendParamsDigestPlaceholder;
    updateParamsDigest(): Promise<void>;
    validateParamsDigest(requireAppParameters?: boolean): Promise<void>;
    [LLSign.OP](sign: LLSign): Promise<void>;
    [LLVerify.OP](verify: LLVerify): Promise<void>;
}

declare interface Interest extends PublicFields {
}

declare namespace Interest {
    /** Generate a random nonce. */
    function generateNonce(): number;
    /** Default InterestLifetime. */
    const DefaultLifetime = 4000;
    /** Constructor argument to set CanBePrefix flag. */
    const CanBePrefix: CtorTag_2;
    /** Constructor argument to set MustBeFresh flag. */
    const MustBeFresh: CtorTag_2;
    /** Constructor argument to set Nonce field. */
    function Nonce(v?: number): CtorTag_2;
    /** Constructor argument to set InterestLifetime field. */
    function Lifetime(v: number): CtorTag_2;
    /** Constructor argument to set HopLimit field. */
    function HopLimit(v: number): CtorTag_2;
    /** Constructor argument. */
    type CtorArg = NameLike | FwHint | CtorTag_2 | Uint8Array;
    /** A function to modify an existing Interest. */
    type ModifyFunc = (interest: Interest) => void;
    /** Common fields to assign onto an existing Interest. */
    type ModifyFields = Partial<Pick<PublicFields, typeof modifyFields[number]>>;
    /** A structure to modify an existing Interest. */
    type Modify = ModifyFunc | ModifyFields;
    /**
     * Turn {@link ModifyFields} to {@link ModifyFunc}.
     * Return {@link ModifyFunc} as-is.
     */
    function makeModifyFunc(input?: Modify): ModifyFunc;
}

declare type IntervalRange = [min: number, max: number];

/** Connected Pty */
declare interface IPty {
    id: string;
    name: string;
    write: EventEmitter<Uint8Array>;
    data: EventEmitter<string>;
    resized: EventEmitter<{
        rows: number;
        cols: number;
    }>;
    focus?: EventEmitter<void>;
    initBuf?: Uint8Array;
}

/** Determine whether the name is a certificate name. */
declare function isCertName(name: Name): boolean;

/**
 Returns a boolean for whether the two given types are equal.

 @link https://github.com/microsoft/TypeScript/issues/27024#issuecomment-421529650
 @link https://stackoverflow.com/questions/68961864/how-does-the-equals-work-in-typescript/68963796#68963796

 Use-cases:
 - If you want to make a conditional branch based on the result of a comparison of two types.

 @example
 ```
 import type {IsEqual} from 'type-fest';

 // This type returns a boolean for whether the given array includes the given item.
 // `IsEqual` is used to compare the given array at position 0 and the given item and then return true if they are equal.
 type Includes<Value extends readonly any[], Item> =
 	Value extends readonly [Value[0], ...infer rest]
 		? IsEqual<Value[0], Item> extends true
 			? true
 			: Includes<rest, Item>
 		: false;
 ```

 @category Type Guard
 @category Utilities
 */
declare type IsEqual<A, B> =
	(<G>() => G extends A ? 1 : 2) extends
	(<G>() => G extends B ? 1 : 2)
		? true
		: false;

/** Determine whether the name is a key name. */
declare function isKeyName(name: Name): boolean;

/**
 Returns a boolean for whether the given type is `never`.

 @link https://github.com/microsoft/TypeScript/issues/31751#issuecomment-498526919
 @link https://stackoverflow.com/a/53984913/10292952
 @link https://www.zhenghao.io/posts/ts-never

 Useful in type utilities, such as checking if something does not occur.

 @example
 ```
 import type {IsNever} from 'type-fest';

 type And<A, B> =
 	A extends true
 		? B extends true
 			? true
 			: false
 		: false;

 // https://github.com/andnp/SimplyTyped/blob/master/src/types/strings.ts
 type AreStringsEqual<A extends string, B extends string> =
 	And<
 		IsNever<Exclude<A, B>> extends true ? true : false,
 		IsNever<Exclude<B, A>> extends true ? true : false
 	>;

 type EndIfEqual<I extends string, O extends string> =
 	AreStringsEqual<I, O> extends true
 		? never
 		: void;

 function endIfEqual<I extends string, O extends string>(input: I, output: O): EndIfEqual<I, O> {
 	if (input === output) {
 		process.exit(0);
 	}
 }

 endIfEqual('abc', 'abc');
 //=> never

 endIfEqual('abc', '123');
 //=> void
 ```

 @category Type Guard
 @category Utilities
 */
declare type IsNever<T> = [T] extends [never] ? true : false;

/** Default issuerId. */
declare const ISSUER_DEFAULT: Component;

/** Self-signed issuerId. */
declare const ISSUER_SELF: Component;

/**
 * Initialization Vector checker.
 *
 * @remarks
 * The `.wrap()` method creates an {@link LLDecrypt.Key} or {@link LLDecrypt} that checks the IV in
 * each message before and after decryption, and updates the internal state of this class.
 * Typically, a separate IvChecker instance should be used for each key.
 */
declare abstract class IvChecker {
    readonly ivLength: number;
    constructor(ivLength: number);
    wrap<T extends LLDecrypt.Key>(key: T): T;
    wrap(f: LLDecrypt): LLDecrypt;
    private wrapKey;
    private wrapLLDecrypt;
    /** Check IV for incoming message and update internal state. */
    protected abstract check(iv: Uint8Array, plaintextLength: number, ciphertextLength: number): void;
}

/**
 * Initialization Vector generator.
 *
 * @remarks
 * The `.wrap()` method creates an {@link LLEncrypt.Key} or {@link LLEncrypt} that generates an
 * IV for each message before encryption, and updates the internal state of this class after
 * encryption. Typically, a separate IVGen instance should be used for each key.
 *
 * If a message presented for encryption already has an IV associated, it would bypass this class.
 * In that case, the IV is not checked and the internal state is not updated.
 */
declare abstract class IvGen {
    readonly ivLength: number;
    constructor(ivLength: number);
    wrap<T extends LLEncrypt.Key>(key: T): T;
    wrap(f: LLEncrypt): LLEncrypt;
    private wrapKey;
    private wrapLLEncrypt;
    /** Generate IV for next message. */
    protected abstract generate(): Uint8Array;
    /** Update internal state after a message is encrypted.. */
    protected update(plaintextLength: number, ciphertextLength: number): void;
}

/** 'KEY' component. */
declare const KEY: Component;

declare interface Key<K extends KeyKind> {
    readonly name: Name;
    readonly [KeyKind]: K;
    readonly spki?: "public" extends K ? Uint8Array : never;
}

/** Storage of own private keys and certificates. */
declare abstract class KeyChain {
    /** Return whether `.insertKey()` method expects JsonWebKey instead of CryptoKey. */
    abstract readonly needJwk: boolean;
    /** List keys, filtered by name prefix. */
    abstract listKeys(prefix?: Name): Promise<Name[]>;
    /** Retrieve key pair by key name. */
    abstract getKeyPair(name: Name): Promise<KeyChain.KeyPair>;
    /**
     * Retrieve key by key name.
     * @param typ - "signer", "verifier", etc.
     */
    getKey<K extends keyof KeyChain.KeyPair>(name: Name, typ: K): Promise<KeyChain.KeyPair[K]>;
    /** Insert key pair. */
    abstract insertKey(name: Name, stored: KeyStore.StoredKey): Promise<void>;
    /** Delete key pair and associated certificates. */
    abstract deleteKey(name: Name): Promise<void>;
    /** List certificates, filtered by name prefix. */
    abstract listCerts(prefix?: Name): Promise<Name[]>;
    /** Retrieve certificate by cert name. */
    abstract getCert(name: Name): Promise<Certificate>;
    /**
     * Insert certificate.
     *
     * @remarks
     * Corresponding key must exist.
     */
    abstract insertCert(cert: Certificate): Promise<void>;
    /** Delete certificate. */
    abstract deleteCert(name: Name): Promise<void>;
    /**
     * Create a signer from keys and certificates in the KeyChain.
     * @param name - Subject name, key name, or certificate name.
     *
     * @remarks
     * If `name` is a certificate name, sign with the corresponding private key, and use the
     * specified certificate name as KeyLocator.
     *
     * If `name` is a key name, sign with the specified private key. If a non-self-signed certificate
     * exists for this key, use the certificate name as KeyLocator. Otherwise, use the key name as
     * KeyLocator.
     *
     * If `name` is neither a certificate name nor a key name, it is interpreted as a subject name.
     * A non-self-signed certificate of this subject name is preferred. If no such certificate
     * exists, use any key of this subject name.
     *
     * If `prefixMatch` is true, `name` can also be interpreted as a prefix of the subject name.
     */
    getSigner(name: Name, { prefixMatch, fallback, useKeyNameKeyLocator }?: KeyChain.GetSignerOptions): Promise<Signer>;
    private findSignerCertName;
}

declare namespace KeyChain {
    type KeyPair<Asym extends boolean = any> = KeyStore.KeyPair<Asym>;
    /** {@link KeyChain.getSigner} options. */
    interface GetSignerOptions {
        /**
         * Whether to allow prefix match between name argument and subject name.
         * @defaultValue false
         *
         * @remarks
         * If `false`, `name` argument must equal subject name, key name, or certificate name.
         * If `true`, `name` argument may be a prefix of subject name.
         */
        prefixMatch?: boolean;
        /**
         * Fallback when no matching or certificate is found.
         *
         * @remarks
         * If this is a function, it is invoked when no matching key or certificate is found. The
         * function should either return a fallback Signer or reject the promise.
         *
         * If this is a Signer, it is used when no matching key or certificate is found.
         */
        fallback?: Signer | ((name: Name, keyChain: KeyChain, err?: Error) => Promise<Signer>);
        /**
         * Whether to prefer key name in KeyLocator.
         * @defaultValue false
         *
         * @remarks
         * If `false`, KeyLocator is a certificate name when a non-self-signed certificate exists.
         * If `true`, KeyLocator is the key name.
         */
        useKeyNameKeyLocator?: boolean;
    }
    /**
     * Open a persistent KeyChain.
     * @param locator - Filesystem directory in Node.js; database name in browser.
     * @param algoList - List of recognized algorithms.
     * Default is {@link CryptoAlgorithmListSlim}. Use {@link CryptoAlgorithmListFull} for all
     * algorithms, at the cost of larger bundle size.
     */
    function open(locator: string, algoList?: readonly CryptoAlgorithm[]): KeyChain;
    /** Open a KeyChain from given KeyStore and CertStore. */
    function open(keys: KeyStore, certs: CertStore): KeyChain;
    /**
     * Create an in-memory ephemeral KeyChain.
     * @param algoList - List of recognized algorithms.
     * Default is {@link CryptoAlgorithmListSlim}. Use {@link CryptoAlgorithmListFull} for all
     * algorithms, at the cost of larger bundle size.
     */
    function createTemp(algoList?: readonly CryptoAlgorithm<any, any, any>[]): KeyChain;
}

declare namespace keychain {
    export {
        CertNaming,
        AesEncryption,
        AesKeyLength,
        AesBlockSize,
        RsaModulusLength,
        AESCBC,
        AESCTR,
        AESGCM,
        EcCurve,
        ECDSA,
        Ed25519,
        HMAC,
        RSA,
        RSAOAEP,
        CryptoAlgorithmListFull,
        EncryptionAlgorithmListFull,
        SigningAlgorithmListFull,
        SigningAlgorithmListSlim,
        EncryptionAlgorithmListSlim,
        CryptoAlgorithmListSlim,
        ValidityPeriod,
        Certificate,
        CounterIvOptions,
        IvChecker,
        CounterIvChecker,
        CounterIvGen,
        IvGen,
        RandomIvGen,
        ImportCertOptions,
        createDecrypter,
        createEncrypter,
        generateEncryptionKey,
        generateSigningKey,
        createSigner,
        createVerifier,
        KeyKind,
        PrivateKey,
        PublicKey,
        SecretKey,
        NamedSigner,
        NamedVerifier,
        NamedEncrypter,
        NamedDecrypter,
        CryptoAlgorithm,
        SigningAlgorithm,
        EncryptionAlgorithm,
        KeyStore,
        CertStore,
        KeyChain,
        KeyChainSerialized
    }
}
export { keychain }

/**
 * KeyChain adapter that serializes function calls.
 *
 * @remarks
 * Only one `s*` function would be invoked at a time. Do not invoke a non-`s*` function from
 * within an `s*` function, otherwise it would cause a deadlock.
 */
declare abstract class KeyChainSerialized extends KeyChain {
    protected readonly mutex: Mutex;
    listKeys(prefix?: Name): Promise<Name[]>;
    protected abstract sListKeys(prefix: Name): Promisable<Name[]>;
    getKeyPair(name: Name): Promise<KeyChain.KeyPair>;
    protected abstract sGetKeyPair(name: Name): Promisable<KeyChain.KeyPair>;
    insertKey(name: Name, stored: KeyStore.StoredKey): Promise<void>;
    protected abstract sInsertKey(name: Name, stored: KeyStore.StoredKey): Promisable<void>;
    deleteKey(name: Name): Promise<void>;
    protected abstract sDeleteKey(name: Name): Promisable<void>;
    listCerts(prefix?: Name): Promise<Name[]>;
    protected abstract sListCerts(prefix: Name): Promisable<Name[]>;
    getCert(name: Name): Promise<Certificate>;
    protected abstract sGetCert(name: Name): Promisable<Certificate>;
    insertCert(cert: Certificate): Promise<void>;
    protected abstract sInsertCert(cert: Certificate): Promisable<void>;
    deleteCert(name: Name): Promise<void>;
    protected abstract sDeleteCert(name: Name): Promisable<void>;
}

/** Identify kind of key. */
declare type KeyKind = "private" | "public" | "secret";

declare namespace KeyKind {
    /** Pick "private" or "secret" based on whether the algorithm is asymmetric. */
    type PrivateSecret<Asym extends boolean> = If<Asym, "private", "secret">;
    /** Pick "public" or "secret" based on whether the algorithm is asymmetric. */
    type PublicSecret<Asym extends boolean> = If<Asym, "public", "secret">;
}

declare const KeyKind: unique symbol;

/** KeyLocator in SigInfo. */
declare class KeyLocator {
    static decodeFrom(decoder: Decoder): KeyLocator;
    constructor(...args: KeyLocator.CtorArg[]);
    name?: Name;
    digest?: Uint8Array;
    encodeTo(encoder: Encoder): void;
}

declare namespace KeyLocator {
    type CtorArg = KeyLocator | NameLike | Uint8Array;
    function isCtorArg(arg: unknown): arg is CtorArg;
    /**
     * Extract KeyLocator name.
     * @throws Error
     * Thrown if KeyLocator is missing or does not have Name.
     */
    function mustGetName(kl?: KeyLocator): Name;
}

/**
 * Map that transforms keys.
 * @typeParam K - Input key type.
 * @typeParam V - Value type.
 * @typeParam I - Indexable key type.
 * @typeParam L - Lookup key type.
 */
declare class KeyMap<K, V, I, L = K> implements Iterable<[key: K, value: V]> {
    private readonly keyOf;
    /**
     * Constructor.
     * @param keyOf - Function to transform input key to indexable key.
     */
    constructor(keyOf: (key: K | L) => I);
    private readonly m;
    get size(): number;
    has(key: K | L): boolean;
    get(key: K | L): V | undefined;
    set(key: K, value: V): this;
    delete(key: K | L): boolean;
    [Symbol.iterator](): IterableIterator<[key: K, value: V]>;
}

/**
 * MultiMap that transforms keys.
 * @typeParam K - Input key type.
 * @typeParam V - Value type.
 * @typeParam I - Indexable key type.
 * @typeParam L - Lookup key type.
 */
declare class KeyMultiMap<K, V, I, L = K> implements Iterable<[key: K, value: V]> {
    /**
     * Constructor.
     * @param keyOf - Function to transform input key to indexable key.
     */
    constructor(keyOf: (key: K | L) => I);
    private readonly m;
    private size_;
    /** Number of distinct keys. */
    get dimension(): number;
    /** Number of values. */
    get size(): number;
    /** Count values associated with a key. */
    count(key: K | L): number;
    /** List values associated with a key. */
    list(key: K | L): ReadonlySet<V>;
    /**
     * Add a key-value pair.
     * Values are stored in a Set, so duplicates are skipped.
     * @returns count(key) after the operation.
     */
    add(key: K, value: V): number;
    /**
     * Remove a key-value pair.
     * No-op if key-value does not exist.
     * @returns `count(key)` after the operation.
     */
    remove(key: K | L, value: V): number;
    /** Iterate over key and associated values. */
    associations(): IterableIterator<[key: K, values: ReadonlySet<V>]>;
    /** Iterate over key-value pairs. */
    [Symbol.iterator](): IterableIterator<[key: K, value: V]>;
}

/**
 * MultiSet that transforms keys.
 * @typeParam K - Input key type.
 * @typeParam I - Indexable key type.
 * @typeParam L - Lookup key type.
 */
declare class KeyMultiSet<K, I, L = K> {
    /**
     * Constructor.
     * @param keyOf - Function to transform input key to indexable key.
     */
    constructor(keyOf: (key: K | L) => I);
    private readonly m;
    private size_;
    /** Number of distinct keys. */
    get dimension(): number;
    /** Number of values. */
    get size(): number;
    /** Count occurrences of a key. */
    count(key: K | L): number;
    /**
     * Add a key.
     * @returns Number of occurrences after the operation.
     */
    add(key: K): number;
    /**
     * Remove a key.
     * No-op if key does not exist.
     * @returns Number of occurrences after the operation.
     */
    remove(key: K): number;
    /** Iterate over key and number of occurrences. */
    multiplicities(): IterableIterator<[key: K, count: number]>;
}

declare interface KeyNameFields {
    subjectName: Name;
    keyId: Component;
}

declare interface KeyState {
    nonces?: Set<string>;
    time?: number;
    seqNum?: bigint;
}

/** KV store of named key pairs. */
declare class KeyStore extends StoreBase<KeyStore.StoredKey> {
    constructor(provider: StoreProvider<KeyStore.StoredKey>, algoList: readonly CryptoAlgorithm[]);
    private readonly loader;
    get(name: Name): Promise<KeyStore.KeyPair>;
    insert(name: Name, stored: KeyStore.StoredKey): Promise<void>;
}

declare namespace KeyStore {
    /** Loaded key pair. */
    class KeyPair<Asym extends boolean = any, I = any> {
        readonly name: Name;
        readonly algo: CryptoAlgorithm<I, Asym>;
        readonly pvt: CryptoAlgorithm.PrivateSecretKey<I, Asym>;
        readonly pub: CryptoAlgorithm.PublicSecretKey<I, Asym>;
        constructor(name: Name, algo: CryptoAlgorithm<I, Asym>, pvt: CryptoAlgorithm.PrivateSecretKey<I, Asym>, pub: CryptoAlgorithm.PublicSecretKey<I, Asym>);
        get signer(): NamedSigner<Asym>;
        get verifier(): NamedVerifier<Asym>;
        get encrypter(): NamedEncrypter<Asym>;
        get decrypter(): NamedDecrypter<Asym>;
        get publicKey(): PublicKey;
    }
    /** Stored key pair in JSON or structuredClone-compatible format. */
    interface StoredKey {
        algo: string;
        info: any;
        jwkImportParams?: AlgorithmIdentifier;
        privateKey?: CryptoKey | JsonWebKey;
        publicKey?: CryptoKey | JsonWebKey;
        publicKeySpki?: Uint8Array | string;
        secretKey?: CryptoKey | JsonWebKey;
    }
    /** Helper to load key pair from stored format. */
    class Loader {
        private readonly extractable;
        private readonly algoList;
        constructor(extractable: boolean, algoList: readonly CryptoAlgorithm[]);
        findAlgo(uuid: string): CryptoAlgorithm<unknown> | undefined;
        loadKey(name: Name, stored: StoredKey): Promise<KeyPair>;
        private loadAsymmetric;
        private loadSymmetric;
    }
}

/** Network layer face for sending and receiving L3 packets. */
declare class L3Face extends TypedEventTarget<EventMap_9> implements FwFace.RxTx {
    private transport;
    /**
     * Constructor.
     * @param transport - Initial transport. It may be replaced through reopen mechanism.
     * @param attributes - Additional attributes.
     * L3Face attributes consist of transport attributes overridden by these attributes.
     * @param lpOptions - NDNLPv2 service options.
     */
    constructor(transport: Transport, attributes?: L3Face.Attributes, lpOptions?: LpService.Options);
    /**
     * Attributes of a network layer face.
     *
     * @remarks
     * When L3Face is added to a logical forwarder, this is copied to {@link FwFace.attributes}.
     */
    readonly attributes: L3Face.Attributes;
    readonly lp: LpService;
    readonly rx: AsyncIterable<FwPacket>;
    private readonly wireTokenPrefix;
    /**
     * Obtain face UP/DOWN state.
     * @remarks
     * Caller can get notifications about state transitions via state/up/down/close events.
     */
    get state(): L3Face.State;
    private set state(value);
    private state_;
    private lastError?;
    private readonly rxSources;
    private reopenRetry?;
    private makeRx;
    private rxTransform;
    private txTransform;
    readonly tx: (iterable: AsyncIterable<FwPacket>) => Promise<void>;
    private reopenTransport;
}

declare namespace L3Face {
    /** Face state. */
    enum State {
        UP = 0,
        DOWN = 1,
        CLOSED = 2
    }
    class StateEvent extends Event {
        readonly state: State;
        readonly prev: State;
        constructor(type: string, state: State, prev: State);
    }
    interface Attributes extends Transport.Attributes {
        /**
         * Whether to readvertise registered routes.
         * @defaultValue `false`.
         * This default is set in {@link CreateFaceFunc} but could be different elsewhere.
         * @remarks
         * This attribute passed to {@link \@ndn/fw!FwFace.Attributes.advertiseFrom}. With the default
         * `false` value, routes "announced" by an L3Face would not be readvertised to
         * {@link \@ndn/fw!ReadvertiseDestination}s, so that remote forwarders would not depend on the
         * local logical forwarder to forward Interests between L3Faces.
         */
        advertiseFrom?: boolean;
    }
    type RxError = LpService.RxError;
    type TxError = LpService.TxError;
    /** Options to `createFace` as first parameter. */
    interface CreateFaceOptions {
        /**
         * Forwarder instance to add the face to.
         * @defaultValue `Forwarder.getDefault()`
         */
        fw?: Forwarder;
        /**
         * Routes to be added on the created face.
         * @defaultValue `["/"]`
         */
        addRoutes?: readonly NameLike[];
        /**
         * L3Face attributes.
         *
         * @remarks
         * `.l3.advertiseFrom` defaults to false in createFace function.
         */
        l3?: Attributes;
        /** NDNLP service options. */
        lp?: LpService.Options;
        /**
         * A callback to receive {@link Transport}, {@link L3Face}, and {@link FwFace} objects.
         *
         * @remarks
         * This can be useful for reading counters or listening to events on these objects.
         */
        callback?: (transport: Transport, l3face: L3Face, fwFace: FwFace) => void;
    }
    type CreateFaceFunc<P extends any[]> = (opts: CreateFaceOptions, ...args: P) => Promise<FwFace>;
    type CreateFacesFunc<P extends any[]> = (opts: CreateFaceOptions, ...args: P) => Promise<FwFace[]>;
    /** Make a function to create a FwFace from a function that creates a transport. */
    function makeCreateFace<P extends any[]>(createTransport: (...args: P) => Promisable<Transport>): CreateFaceFunc<P>;
    /** Make a function to create FwFaces from a function that creates transports. */
    function makeCreateFace<P extends any[]>(createTransports: (...args: P) => Promisable<Transport[]>): CreateFacesFunc<P>;
    /**
     * Add routes to a FwFace.
     * @param fwFace - Target FwFace.
     * @param addRoutes - List of routes.
     * @remarks
     * This function is typically used for implementing {@link CreateFaceOptions.addRoutes}.
     */
    function processAddRoutes(fwFace: FwFace, addRoutes?: readonly NameLike[]): void;
}

declare type L3Pkt = Interest | Data | Nack;

declare type Len = 1 | 2 | 4 | 8;

/** DataStore interface, listData method. */
declare interface ListData {
    /** List Data packets, optionally filtered by name prefix. */
    listData: (prefix?: Name) => AsyncIterable<Data>;
}

/** DataStore interface, listNames method. */
declare interface ListNames {
    /** List Data names, optionally filtered by name prefix. */
    listNames: (prefix?: Name) => AsyncIterable<Name>;
}

/** Low level decryption function. */
declare type LLDecrypt = (params: LLDecrypt.Params) => Promise<LLDecrypt.Result>;

declare namespace LLDecrypt {
    /** Input of LLDecrypt function. */
    interface Params {
        ciphertext: Uint8Array;
        iv?: Uint8Array;
        authenticationTag?: Uint8Array;
        additionalData?: Uint8Array;
    }
    /** Output of LLDecrypt function. */
    interface Result {
        plaintext: Uint8Array;
    }
    /** Object that provides LLDecrypt function, such as secret key. */
    interface Key {
        readonly llDecrypt: LLDecrypt;
    }
}

/** Low level encryption function. */
declare type LLEncrypt = (params: LLEncrypt.Params) => Promise<LLEncrypt.Result>;

declare namespace LLEncrypt {
    /** Input of LLEncrypt function. */
    interface Params {
        plaintext: Uint8Array;
        iv?: Uint8Array;
        additionalData?: Uint8Array;
    }
    /** Output of LLEncrypt function. */
    interface Result {
        ciphertext: Uint8Array;
        iv?: Uint8Array;
        authenticationTag?: Uint8Array;
    }
    /** Object that provides LLEncrypt function, such as secret key. */
    interface Key {
        readonly llEncrypt: LLEncrypt;
    }
}

/**
 * Low level signing function.
 * @param input - Buffer of signed portion.
 * @returns Promise resolves to signature value or rejects with error.
 */
declare type LLSign = (input: Uint8Array) => Promise<Uint8Array>;

declare namespace LLSign {
    const OP: unique symbol;
    /** Target packet compatible with low level signing function. */
    interface Signable {
        [OP]: (signer: LLSign) => Promise<void>;
    }
}

/**
 * Low level verification function.
 * @param input - Buffer of signed portion.
 * @param sig - Buffer of signature value.
 * @returns Promise resolves upon good signature or rejects upon bad signature.
 */
declare type LLVerify = (input: Uint8Array, sig: Uint8Array) => Promise<void>;

declare namespace LLVerify {
    const OP: unique symbol;
    /** Target packet compatible with low level verification function. */
    interface Verifiable {
        [OP]: (verifier: LLVerify) => Promise<void>;
    }
}

/**
 * Acquire a semaphore for unlocking via Disposable.
 * @param semaphore - Semaphore or Mutex from `wait-your-turn` package.
 */
declare function lock(semaphore: Pick<Semaphore, "acquire">): Promise<Disposable>;

/**
 * Perform name longest prefix match on a container of entries.
 * @typeParam T - Entry type, which must not be `undefined`.
 * @param name - Lookup target name.
 * @param get - Callback function to retrieve entry by name prefix TLV-VALUE in hexadecimal format.
 * @returns Matched entries.
 * The first result is the longest prefix match. Subsequent results are matches on successively
 * shorter prefixes. The caller may early-return the iterator to ignore subsequent results.
 */
declare function lpm<T>(name: Name, get: (prefixHex: string) => T | undefined): Iterable<T>;

/** NDNLPv2 service. */
declare class LpService {
    private readonly transport;
    constructor({ keepAlive, mtu, reassemblerCapacity, }: LpService.Options, transport: LpService.Transport);
    private readonly keepAlive?;
    private readonly mtu;
    private readonly fragmenter;
    private readonly reassembler;
    readonly rx: (iterable: AsyncIterable<Decoder.Tlv>) => AsyncIterable<LpService.Packet | LpService.RxError>;
    private decode;
    private decodeL3;
    readonly tx: (iterable: AsyncIterable<LpService.Packet>) => AsyncIterable<Uint8Array | LpService.TxError>;
    private encode;
}

declare namespace LpService {
    /** An object that reports transport MTU. */
    interface Transport {
        /** Current transport MTU. */
        readonly mtu: number;
    }
    interface Options {
        /**
         * How often to send IDLE packets if nothing else was sent, in milliseconds.
         * Set `false` or zero to disable keep-alive.
         * @defaultValue 60000
         */
        keepAlive?: false | number;
        /**
         * Administrative MTU.
         * The lesser of this MTU and the transport's reported MTU is used for fragmentation.
         * @defaultValue Infinity
         */
        mtu?: number;
        /**
         * Maximum number of partial packets kept in the reassembler.
         * @defaultValue 16
         */
        reassemblerCapacity?: number;
    }
    type L3Pkt = Interest | Data | Nack;
    interface Packet {
        l3: L3Pkt;
        token?: Uint8Array;
        congestionMark?: number;
    }
    class RxError extends Error {
        readonly packet: Uint8Array;
        constructor(inner: Error, packet: Uint8Array);
    }
    class TxError extends Error {
        readonly packet: L3Pkt;
        constructor(inner: Error, packet: L3Pkt);
    }
        {};
}

/**
 * Create certificate name from subject name, key name, or certificate name.
 * @param name - Subject name, key name, or certificate name.
 *
 * @remarks
 * If `name` is a subject name, it's concatenated with additional components to make a certificate name:
 * - *KeyId* component is set to `.opts.keyId`.
 *   If unset, it defaults to the current timestamp.
 *
 * If `name` is a key name, it's concatenated with additional components to make a certificate name:
 * - *KeyId* component is set to `.opts.keyId`.
 *   If unset, it defaults to TimestampNameComponent of the current timestamp.
 * - *IssuerId* component is set to `.opts.issuerId`.
 *   If unset, it defaults to "NDNts".
 * - *Version* component is set to `.opts.version`.
 *   If unset, it defaults to VersionNameComponent of the current timestamp in milliseconds.
 *
 * If `name` is a certificate name, it is returned unchanged.
 */
declare function makeCertName(name: Name, opts?: Partial<Pick<CertNameFields, "keyId" | "issuerId" | "version">>): Name;

/**
 * Create key name from subject name, key name, or certificate name.
 * @param name - Subject name, key name, or certificate name.
 *
 * @remarks
 * If `name` is a subject name, it's concatenated with additional components to make a key name:
 * - *KeyId* component is set to `.opts.keyId`.
 *   If unset, it defaults to TimestampNameComponent of the current timestamp.
 *
 * If `name` is a key name, it is returned unchanged.
 *
 * If `name` is a certificate name, its key name portion is returned.
 */
declare function makeKeyName(name: Name, opts?: Partial<Pick<KeyNameFields, "keyId">>): Name;

/** Create algorithm parameters to be compatible with PSync C++ library. */
declare function makePSyncCompatParam({ keyToBufferLittleEndian, expectedEntries, expectedSubscriptions, ibltCompression, contentCompression, }?: makePSyncCompatParam.Options): FullSync.Parameters & PartialPublisher.Parameters & PartialSubscriber.Parameters;

declare namespace makePSyncCompatParam {
    interface Options {
        /**
         * Whether to use little endian when converting uint32 key to Uint8Array.
         * @defaultValue true
         *
         * @remarks
         * PSync C++ library behaves differently on big endian and little endian machines,
         * {@link https://github.com/named-data/PSync/blob/b60398c5fc216a1b577b9dbcf61d48a21cb409a4/PSync/detail/util.cpp#L126}
         * This must be set to match other peers.
         */
        keyToBufferLittleEndian?: boolean;
        /**
         * Expected number of IBLT entries, i.e. expected number of updates in a sync cycle.
         * @defaultValue 80
         *
         * @remarks
         * This is irrelevant to PartialSync consumer.
         */
        expectedEntries?: number;
        /**
         * Estimated number of subscriptions in PartialSync consumer.
         * @defaultValue 16
         */
        expectedSubscriptions?: number;
        /**
         * Whether to use zlib compression on IBLT.
         * @defaultValue no compression
         *
         * @remarks
         * Use {@link PSyncZlib} to set zlib compression.
         *
         * In PSync C++ library, default for FullSync depends on whether zlib is available at compile
         * time, and default for PartialSync is no compression.
         * This must be set to match other peers.
         */
        ibltCompression?: PSyncCodec.Compression;
        /**
         * Whether to use zlib compression on Data payload.
         * @defaultValue no compression
         *
         * @remarks
         * Use {@link PSyncZlib} to set zlib compression.
         *
         * In PSync C++ library, default for FullSync depends on whether zlib is available at compile
         * time. For PartialSync, it is always no compression.
         * This must be set to match other peers.
         */
        contentCompression?: PSyncCodec.Compression;
    }
}

/** Create algorithm parameters to be compatible with DNMP-v2 syncps library. */
declare function makeSyncpsCompatParam({ keyToBufferLittleEndian, expectedEntries, }?: makeSyncpsCompatParam.Options): SyncpsPubsub.Parameters;

declare namespace makeSyncpsCompatParam {
    interface Options {
        /**
         * Whether to use little endian when converting a uint32 key to a byte array.
         * @defaultValue true
         *
         * @remarks
         * ndn-ind behaves differently on big endian and little endian machines,
         * {@link https://github.com/operantnetworks/ndn-ind/blob/dd934a7a5106cda6ea14675554427e12df1ce18f/src/lite/util/crypto-lite.cpp#L114}
         * This must be set to match other peers.
         */
        keyToBufferLittleEndian?: boolean;
        /**
         * Expected number of IBLT entries, i.e. expected number of updates in a sync cycle.
         * @defaultValue 85
         */
        expectedEntries?: number;
    }
}

/** SVS-PS MappingEntry element. */
declare class MappingEntry implements EncodableObj {
    seqNum: number;
    name: Name;
    static decodeFrom(decoder: Decoder): MappingEntry;
    encodeTo(encoder: Encoder): void;
    protected encodeValueExt(): Encodable[];
}

declare namespace MappingEntry {
    interface Constructor<M extends MappingEntry = MappingEntry> extends Decodable<M> {
        new (): M;
    }
    /** Class decorator on an extensible MappingEntry subclass. */
    function extend<M extends MappingEntry & Extensible>(ctor: new () => M, ctx?: ClassDecoratorContext): void;
}

declare const modifyFields: readonly ["canBePrefix", "mustBeFresh", "fwHint", "lifetime", "hopLimit"];

/** Container that associates a key with multiple distinct values. */
declare class MultiMap<K, V> extends KeyMultiMap<K, V, K> {
    constructor();
}

declare class Mutex extends Semaphore {
    constructor();
}

/** Nack packet. */
declare class Nack {
    interest: Interest;
    get reason(): number;
    set reason(v: number);
    header: NackHeader;
    constructor(interest: Interest, header?: NackHeader | number);
}

/** Nack header. */
declare class NackHeader {
    get reason(): number;
    set reason(v: number);
    private reason_;
    static decodeFrom(decoder: Decoder): NackHeader;
    constructor(reason?: number);
    encodeTo(encoder: Encoder): void;
}

declare const NackReason: {
    readonly Congestion: 50;
    readonly Duplicate: 100;
    readonly NoRoute: 150;
};

/**
 * Name.
 *
 * @remarks
 * This type is immutable.
 */
declare class Name {
    static decodeFrom(decoder: Decoder): Name;
    /**
     * Create Name from Name or Name URI.
     *
     * @remarks
     * This is more efficient than `new Name(input)` if input is already a Name.
     */
    static from(input: NameLike): Name;
    /** Create empty name, or copy from other name, or parse from URI. */
    constructor(input?: NameLike);
    /** Parse from URI, with specific component parser. */
    constructor(uri: string, parseComponent?: (input: string) => Component);
    /** Construct from TLV-VALUE. */
    constructor(value: Uint8Array);
    /** Construct from components. */
    constructor(comps: readonly ComponentLike[]);
    /** List of name components. */
    readonly comps: readonly Component[];
    private readonly valueEncoderBufSize?;
    private value_?;
    private uri_?;
    private hex_?;
    /** Number of name components. */
    get length(): number;
    /** Name TLV-VALUE. */
    get value(): Uint8Array;
    /** Name TLV-VALUE hexadecimal representation, good for map keys. */
    get valueHex(): string;
    /**
     * Retrieve i-th component.
     * @param i - Component index. Negative number counts from the end.
     * @returns i-th component, or `undefined` if it does not exist.
     */
    get(i: number): Component | undefined;
    /**
     * Retrieve i-th component.
     * @param i - Component index. Negative number counts from the end.
     * @returns i-th component.
     *
     * @throws RangeError
     * Thrown if i-th component does not exist.
     */
    at(i: number): Component;
    /** Get URI string. */
    toString(): string;
    /** Get sub name `[begin,end)`. */
    slice(begin?: number, end?: number): Name;
    /** Get prefix of `n` components. */
    getPrefix(n: number): Name;
    /** Append a component from naming convention. */
    append<A>(convention: NamingConvention<A, unknown>, v: A): Name;
    /** Append suffix with one or more components. */
    append(...suffix: readonly ComponentLike[]): Name;
    /** Return a copy of Name with i-th component replaced with `comp`. */
    replaceAt(i: number, comp: ComponentLike): Name;
    /** Compare with other name. */
    compare(other: NameLike): Name.CompareResult;
    /** Determine if this name equals other. */
    equals(other: NameLike): boolean;
    /** Determine if this name is a prefix of other. */
    isPrefixOf(other: NameLike): boolean;
    private comparePrefix;
    encodeTo(encoder: Encoder): void;
}

declare namespace Name {
    /** Determine if obj is Name or Name URI. */
    function isNameLike(obj: any): obj is NameLike;
    /** Name compare result. */
    enum CompareResult {
        /** lhs is less than, but not a prefix of rhs */
        LT = -2,
        /** lhs is a prefix of rhs */
        LPREFIX = -1,
        /** lhs and rhs are equal */
        EQUAL = 0,
        /** rhs is a prefix of lhs */
        RPREFIX = 1,
        /** rhs is less than, but not a prefix of lhs */
        GT = 2
    }
}

/** Named private key or secret key decrypter. */
declare interface NamedDecrypter<Asym extends boolean = any> extends Key<KeyKind.PrivateSecret<Asym>>, LLDecrypt.Key {
}

declare namespace NamedDecrypter {
    /** Named private key decrypter. */
    type PrivateKey = NamedDecrypter<true>;
    /** Named secret key decrypter. */
    type SecretKey = NamedDecrypter<false>;
}

/** Named public key or secret key encrypter. */
declare interface NamedEncrypter<Asym extends boolean = any> extends Key<KeyKind.PublicSecret<Asym>>, LLEncrypt.Key {
}

declare namespace NamedEncrypter {
    /** Named public key encrypter. */
    type PublicKey = NamedEncrypter<true>;
    /** Named secret key encrypter. */
    type SecretKey = NamedEncrypter<false>;
}

/** Named private key or secret key signer. */
declare interface NamedSigner<Asym extends boolean = any> extends Key<KeyKind.PrivateSecret<Asym>>, Signer {
    /** SigInfo.sigType number for signatures created by this signer. */
    readonly sigType: number;
    /** Create a Signer that signs with this private key but a different KeyLocator. */
    withKeyLocator: (keyLocator: KeyLocator.CtorArg) => Signer;
}

declare namespace NamedSigner {
    /** Named private key signer. */
    type PrivateKey = NamedSigner<true>;
    /** Named secret key signer. */
    type SecretKey = NamedSigner<false>;
}

/** Named public key or secret key verifier. */
declare interface NamedVerifier<Asym extends boolean = any> extends Key<KeyKind.PublicSecret<Asym>>, Verifier {
    /** SigInfo.sigType number for signatures accepted by this verifier. */
    readonly sigType: number;
}

declare namespace NamedVerifier {
    /** Named public key verifier. */
    type PublicKey = NamedVerifier<true>;
    /** Named secret key verifier. */
    type SecretKey = NamedVerifier<false>;
}

/** Name or Name URI. */
declare type NameLike = Name | string;

/**
 * Map keyed by name.
 * Lookups may accept either name or `name.valueHex`.
 */
declare class NameMap<V> extends KeyMap<Name, V, string, string> {
    constructor();
}

/**
 * MultiMap keyed by name.
 * Lookups may accept either name or `name.valueHex`.
 */
declare class NameMultiMap<V> extends KeyMultiMap<Name, V, string, string> {
    constructor();
}

/**
 * MultiSet keyed by name.
 * Lookups may accept either name or `name.valueHex`.
 */
declare class NameMultiSet extends KeyMultiSet<Name, string, string> {
    constructor();
}

/**
 * Naming convention, which interprets a name component in a specific way.
 * @typeParam A - Input type to construct component.
 * @typeParam R - Output type to interpret component.
 */
declare interface NamingConvention<A, R = A> {
    /** Determine if a component follows this naming convention. */
    match: (comp: Component) => boolean;
    /** Create a component from input value following this naming convention. */
    create: (v: A) => Component;
    /** Parse value of a matched component. */
    parse: (comp: Component) => R;
}

declare namespace NamingConvention {
    /** A naming convention that supports alternate/pretty URI. */
    interface WithAltUri {
        /** Convert to alternate URI. */
        toAltUri: (comp: Component) => string;
        /**
         * Parse from alternate URI.
         * @returns Component, or `undefined` if it cannot be parsed.
         */
        fromAltUri: (input: string) => Component | undefined;
    }
    /** Determine whether an object implements `NamingConvention` interface. */
    function isConvention(obj: any): obj is NamingConvention<any>;
}

declare class NFW {
    private readonly topo;
    readonly nodeId: IdType;
    /** NDNts forwarder */
    fw: Forwarder;
    /** Local face for content store etc */
    localFace: FwFace;
    /** Push channel to local face */
    private localFaceTx;
    /** Browser Forwarding Provider */
    provider: ProviderBrowser;
    /** Security options */
    securityOptions?: {
        /** Signer object */
        signer: Signer;
        /** Verifier object */
        verifier: Verifier;
        /** Keychain */
        keyChain: KeyChain;
    };
    /** Forwarding table */
    fib: any[];
    /** Enable packet capture */
    capture: boolean;
    /** Content Store */
    private cs;
    /** Dead Nonce List */
    private dnl;
    /** Routing strategies */
    readonly strategies: {
        prefix: Name;
        strategy: string;
    }[];
    /** Default servers */
    defualtServers: DefaultServers;
    /** Connections to other NFWs */
    private connections;
    /** Aggregate of sent interests */
    private pit;
    /** Announcements current */
    private announcements;
    /** Extra parameters of node */
    private nodeExtra;
    /** Packet capture */
    private shark;
    constructor(topo: Topology, nodeId: IdType);
    node(): INode;
    nodeUpdated(): void;
    /** Update color of current node */
    updateColors(): void;
    /** Add traffic to link */
    private addLinkTraffic;
    private checkPrefixRegistrationMatches;
    private longestMatch;
    private allMatches;
    private expressInterest;
    private getConnection;
    strsFIB(): string[];
    getEndpoint(opts?: {}): Endpoint;
}

/**
 * Create Encodable from non-negative integer.
 *
 * @throws RangeError
 * Thrown if the number may lose precision and `unsafe` option is not set.
 */
declare function NNI(n: number | bigint, { len, unsafe, }?: NNI.Options): Encodable;

declare namespace NNI {
    interface Options {
        /**
         * Encode to specific length.
         * Enforce specific length during decoding.
         */
        len?: Len;
        /**
         * Decode to bigint instead of number.
         * @defaultValue `false`
         */
        big?: boolean;
        /**
         * Permit large numbers that exceed MAX_SAFE_INTEGER, which may lose precision.
         * @defaultValue `false`
         */
        unsafe?: boolean;
    }
    /** Determine if len is a valid length of encoded NNI. */
    function isValidLength(len: number): boolean;
    /** Decode non-negative integer as number. */
    function decode(value: Uint8Array, opts?: Options & {
        big?: false;
    }): number;
    /** Decode non-negative integer as bigint. */
    function decode(value: Uint8Array, opts: Options & {
        big: true;
    }): bigint;
}

/** Encrypter and decrypter that do nothing. */
declare const noopEncryption: Encrypter<any> & Decrypter<any>;

/** Signer and Verifier that do nothing. */
declare const noopSigning: Signer & Verifier;

/**
 * Signer for SigType.Null, a packet that is not signed.
 * @see https://redmine.named-data.net/projects/ndn-tlv/wiki/NullSignature
 */
declare const nullSigner: Signer;

/**
 * A representation of any set of values over any amount of time. This is the most basic building block
 * of RxJS.
 *
 * @class Observable<T>
 */
declare class Observable<T> implements Subscribable<T> {
    /**
     * @deprecated Internal implementation detail, do not use directly. Will be made internal in v8.
     */
    source: Observable<any> | undefined;
    /**
     * @deprecated Internal implementation detail, do not use directly. Will be made internal in v8.
     */
    operator: Operator<any, T> | undefined;
    /**
     * @constructor
     * @param {Function} subscribe the function that is called when the Observable is
     * initially subscribed to. This function is given a Subscriber, to which new values
     * can be `next`ed, or an `error` method can be called to raise an error, or
     * `complete` can be called to notify of a successful completion.
     */
    constructor(subscribe?: (this: Observable<T>, subscriber: Subscriber_2<T>) => TeardownLogic);
    /**
     * Creates a new Observable by calling the Observable constructor
     * @owner Observable
     * @method create
     * @param {Function} subscribe? the subscriber function to be passed to the Observable constructor
     * @return {Observable} a new observable
     * @nocollapse
     * @deprecated Use `new Observable()` instead. Will be removed in v8.
     */
    static create: (...args: any[]) => any;
    /**
     * Creates a new Observable, with this Observable instance as the source, and the passed
     * operator defined as the new observable's operator.
     * @method lift
     * @param operator the operator defining the operation to take on the observable
     * @return a new observable with the Operator applied
     * @deprecated Internal implementation detail, do not use directly. Will be made internal in v8.
     * If you have implemented an operator using `lift`, it is recommended that you create an
     * operator by simply returning `new Observable()` directly. See "Creating new operators from
     * scratch" section here: https://rxjs.dev/guide/operators
     */
    lift<R>(operator?: Operator<T, R>): Observable<R>;
    subscribe(observerOrNext?: Partial<Observer<T>> | ((value: T) => void)): Subscription_2;
    /** @deprecated Instead of passing separate callback arguments, use an observer argument. Signatures taking separate callback arguments will be removed in v8. Details: https://rxjs.dev/deprecations/subscribe-arguments */
    subscribe(next?: ((value: T) => void) | null, error?: ((error: any) => void) | null, complete?: (() => void) | null): Subscription_2;
    /**
     * Used as a NON-CANCELLABLE means of subscribing to an observable, for use with
     * APIs that expect promises, like `async/await`. You cannot unsubscribe from this.
     *
     * **WARNING**: Only use this with observables you *know* will complete. If the source
     * observable does not complete, you will end up with a promise that is hung up, and
     * potentially all of the state of an async function hanging out in memory. To avoid
     * this situation, look into adding something like {@link timeout}, {@link take},
     * {@link takeWhile}, or {@link takeUntil} amongst others.
     *
     * #### Example
     *
     * ```ts
     * import { interval, take } from 'rxjs';
     *
     * const source$ = interval(1000).pipe(take(4));
     *
     * async function getTotal() {
     *   let total = 0;
     *
     *   await source$.forEach(value => {
     *     total += value;
     *     console.log('observable -> ' + value);
     *   });
     *
     *   return total;
     * }
     *
     * getTotal().then(
     *   total => console.log('Total: ' + total)
     * );
     *
     * // Expected:
     * // 'observable -> 0'
     * // 'observable -> 1'
     * // 'observable -> 2'
     * // 'observable -> 3'
     * // 'Total: 6'
     * ```
     *
     * @param next a handler for each value emitted by the observable
     * @return a promise that either resolves on observable completion or
     *  rejects with the handled error
     */
    forEach(next: (value: T) => void): Promise<void>;
    /**
     * @param next a handler for each value emitted by the observable
     * @param promiseCtor a constructor function used to instantiate the Promise
     * @return a promise that either resolves on observable completion or
     *  rejects with the handled error
     * @deprecated Passing a Promise constructor will no longer be available
     * in upcoming versions of RxJS. This is because it adds weight to the library, for very
     * little benefit. If you need this functionality, it is recommended that you either
     * polyfill Promise, or you create an adapter to convert the returned native promise
     * to whatever promise implementation you wanted. Will be removed in v8.
     */
    forEach(next: (value: T) => void, promiseCtor: PromiseConstructorLike): Promise<void>;
    pipe(): Observable<T>;
    pipe<A>(op1: OperatorFunction<T, A>): Observable<A>;
    pipe<A, B>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>): Observable<B>;
    pipe<A, B, C>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>): Observable<C>;
    pipe<A, B, C, D>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>): Observable<D>;
    pipe<A, B, C, D, E>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>): Observable<E>;
    pipe<A, B, C, D, E, F>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>): Observable<F>;
    pipe<A, B, C, D, E, F, G>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>, op7: OperatorFunction<F, G>): Observable<G>;
    pipe<A, B, C, D, E, F, G, H>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>, op7: OperatorFunction<F, G>, op8: OperatorFunction<G, H>): Observable<H>;
    pipe<A, B, C, D, E, F, G, H, I>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>, op7: OperatorFunction<F, G>, op8: OperatorFunction<G, H>, op9: OperatorFunction<H, I>): Observable<I>;
    pipe<A, B, C, D, E, F, G, H, I>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>, op7: OperatorFunction<F, G>, op8: OperatorFunction<G, H>, op9: OperatorFunction<H, I>, ...operations: OperatorFunction<any, any>[]): Observable<unknown>;
    /** @deprecated Replaced with {@link firstValueFrom} and {@link lastValueFrom}. Will be removed in v8. Details: https://rxjs.dev/deprecations/to-promise */
    toPromise(): Promise<T | undefined>;
    /** @deprecated Replaced with {@link firstValueFrom} and {@link lastValueFrom}. Will be removed in v8. Details: https://rxjs.dev/deprecations/to-promise */
    toPromise(PromiseCtor: typeof Promise): Promise<T | undefined>;
    /** @deprecated Replaced with {@link firstValueFrom} and {@link lastValueFrom}. Will be removed in v8. Details: https://rxjs.dev/deprecations/to-promise */
    toPromise(PromiseCtor: PromiseConstructorLike): Promise<T | undefined>;
}

/**
 * An object interface that defines a set of callback functions a user can use to get
 * notified of any set of {@link Observable}
 * {@link guide/glossary-and-semantics#notification notification} events.
 *
 * For more info, please refer to {@link guide/observer this guide}.
 */
declare interface Observer<T> {
    /**
     * A callback function that gets called by the producer during the subscription when
     * the producer "has" the `value`. It won't be called if `error` or `complete` callback
     * functions have been called, nor after the consumer has unsubscribed.
     *
     * For more info, please refer to {@link guide/glossary-and-semantics#next this guide}.
     */
    next: (value: T) => void;
    /**
     * A callback function that gets called by the producer if and when it encountered a
     * problem of any kind. The errored value will be provided through the `err` parameter.
     * This callback can't be called more than one time, it can't be called if the
     * `complete` callback function have been called previously, nor it can't be called if
     * the consumer has unsubscribed.
     *
     * For more info, please refer to {@link guide/glossary-and-semantics#error this guide}.
     */
    error: (err: any) => void;
    /**
     * A callback function that gets called by the producer if and when it has no more
     * values to provide (by calling `next` callback function). This means that no error
     * has happened. This callback can't be called more than one time, it can't be called
     * if the `error` callback function have been called previously, nor it can't be called
     * if the consumer has unsubscribed.
     *
     * For more info, please refer to {@link guide/glossary-and-semantics#complete this guide}.
     */
    complete: () => void;
}

/***
 * @deprecated Internal implementation detail, do not use directly. Will be made internal in v8.
 */
declare interface Operator<T, R> {
    call(subscriber: Subscriber_2<R>, source: any): TeardownLogic;
}

declare interface OperatorFunction<T, R> extends UnaryFunction<Observable<T>, Observable<R>> {
}

/** StructBuilder field options. */
declare interface Options<Required extends boolean, Repeat extends boolean, FlagPrefix extends string, FlagBit extends string> extends EvDecoder.RuleOptions {
    /**
     * Whether the field is required.
     * If both `.required` and `.repeat` are false, the field may be set to undefined and is initialized as undefined.
     * @defaultValue `false`
     */
    required?: Required;
    /**
     * Whether the field is repeated.
     * If `.repeat` is true, the field is defined as an array and is initialized as an empty array.
     * @defaultValue `false`
     */
    repeat?: Repeat;
    /**
     * Prefix of bit property names.
     * Ignored if `.flagBits` is unspecified.
     *
     * @defaultValue
     * Same as primary field name.
     */
    flagPrefix?: FlagPrefix;
    /**
     * Mapping from bit name to bit value.
     * If specified, the field is treated as bit flags.
     */
    flagBits?: Record<FlagBit, number>;
}

/**
 * {@link Endpoint} constructor options.
 *
 * @remarks
 * This type includes consumer and producer options. These settings will be inherited by
 * {@link Endpoint.consume} and {@link Endpoint.produce} unless overridden.
 */
declare interface Options_2 extends ConsumerOptions, ProducerOptions {
    /**
     * Logical forwarder instance.
     * @defaultValue `Forwarder.getDefault()`
     */
    fw?: Forwarder;
}

declare namespace packet {
    export {
        lpm,
        AltUriConverter,
        AltUri,
        ComponentLike,
        Component,
        NamingConvention,
        ImplicitDigest,
        ParamsDigest,
        NameLike,
        Name,
        NameMap,
        NameMultiMap,
        NameMultiSet,
        StructFieldName,
        StructFieldNameNested,
        StructFieldComponentNested,
        LLEncrypt,
        LLDecrypt,
        Encrypter,
        Decrypter,
        noopEncryption,
        SignedInterestPolicy,
        LLSign,
        LLVerify,
        Signer,
        Verifier,
        noopSigning,
        digestSigning,
        nullSigner,
        TT,
        SigType,
        NackReason,
        Data,
        FwHint,
        Interest,
        KeyLocator,
        NackHeader,
        Nack,
        SigInfo
    }
}
export { packet }

declare interface PacketWithSignature {
    readonly name: Name;
    sigInfo?: SigInfo;
    sigValue: Uint8Array;
}

/**
 * Bloom filter algorithm parameters.
 *
 * All participants must agree on the same parameters in order to communicate.
 */
declare interface Parameters_2 {
    hash: HashFunction;
    projectedElementCount: number;
    falsePositiveProbability: number;
}

/** ParametersSha256DigestComponent */
declare const ParamsDigest: ParamsDigestComp;

declare class ParamsDigestComp extends DigestComp {
    /** ParamsDigest placeholder during Interest encoding. */
    readonly PLACEHOLDER: Component;
    /** Determine if comp is a ParamsDigest placeholder. */
    isPlaceholder(comp: Component): boolean;
    /** Find ParamsDigest or placeholder in name. */
    findIn(name: Name, matchPlaceholder?: boolean): number;
}

/**
 * Parse a certificate name into fields.
 * @param name - Must be a certificate name.
 */
declare function parseCertName(name: Name): CertNameFields;

/**
 * Parse a key name into fields.
 * @param name - Must be a key name.
 */
declare function parseKeyName(name: Name): KeyNameFields;

/** PSync - PartialSync publisher. */
declare class PartialPublisher extends TypedEventTarget<EventMap_4> implements SyncProtocol<Name> {
    constructor({ p, endpoint, describe, syncPrefix, helloReplyFreshness, syncReplyFreshness, signer, producerBufferLimit, }: PartialPublisher.Options);
    private readonly maybeHaveEventListener;
    private readonly endpoint;
    readonly describe: string;
    private readonly syncPrefix;
    private readonly c;
    private readonly codec;
    private closed;
    private readonly pBuffer;
    private readonly hFreshness;
    private readonly hProducer;
    private readonly sFreshness;
    private readonly sProducer;
    private readonly sPendings;
    private debug;
    /** Stop the protocol operation. */
    close(): void;
    get(prefix: Name): SyncNode<Name> | undefined;
    add(prefix: Name): SyncNode<Name>;
    private readonly handleHelloInterest;
    private readonly handleSyncInterest;
    private readonly handleIncreaseSeqNum;
    private sendStateData;
}

declare namespace PartialPublisher {
    /** Algorithm parameters. */
    interface Parameters extends PSyncCore.Parameters, PSyncCodec.Parameters {
    }
    /** {@link PartialPublisher} constructor options. */
    interface Options {
        /**
         * Algorithm parameters.
         *
         * @remarks
         * They must match the subscriber parameters.
         */
        p: Parameters;
        /**
         * Endpoint for communication.
         * @defaultValue
         * Endpoint on default logical forwarder.
         */
        endpoint?: Endpoint;
        /** Description for debugging purpose. */
        describe?: string;
        /** Sync producer prefix. */
        syncPrefix: Name;
        /**
         * FreshnessPeriod of hello reply Data packet.
         * @defaultValue 1000
         */
        helloReplyFreshness?: number;
        /**
         * FreshnessPeriod of sync reply Data packet.
         * @defaultValue 1000
         */
        syncReplyFreshness?: number;
        /**
         * Signer of sync reply Data packets.
         * @defaultValue digestSigning
         */
        signer?: Signer;
        /**
         * How many sync reply segmented objects to keep in buffer.
         * This must be a positive integer.
         * @defaultValue 32
         */
        producerBufferLimit?: number;
    }
}

/** PSync - PartialSync subscriber. */
declare class PartialSubscriber extends TypedEventTarget<EventMap_5> implements Subscriber<Name, Update, PartialSubscriber.TopicInfo> {
    constructor({ p, endpoint, describe, syncPrefix, syncInterestLifetime, syncInterestInterval, verifier, }: PartialSubscriber.Options);
    readonly describe: string;
    private readonly helloPrefix;
    private readonly syncPrefix;
    private readonly codec;
    private readonly encodeBloom;
    private closed;
    private readonly subs;
    private readonly prevSeqNums;
    private bloom;
    private ibltComp?;
    private readonly cFetcher;
    private readonly cInterval;
    private cTimer;
    private cAbort?;
    private debug;
    /** Stop the protocol operation. */
    close(): void;
    subscribe(topic: PartialSubscriber.TopicInfo): Sub;
    private readonly handleRemoveTopic;
    private scheduleInterest;
    private readonly sendInterest;
    private sendHelloInterest;
    private sendSyncInterest;
    private handleState;
}

declare namespace PartialSubscriber {
    /** Algorithm parameters. */
    interface Parameters extends PSyncCore.Parameters, PSyncCodec.Parameters {
        bloom: Parameters_2;
    }
    /** {@link PartialSubscriber} constructor options. */
    interface Options {
        /**
         * Algorithm parameters.
         *
         * @remarks
         * They must match the publisher parameters.
         */
        p: Parameters;
        /**
         * Endpoint for communication.
         * @defaultValue
         * Endpoint on default logical forwarder.
         */
        endpoint?: Endpoint;
        /** Description for debugging purpose. */
        describe?: string;
        /** Sync producer prefix. */
        syncPrefix: Name;
        /**
         * Sync Interest lifetime in milliseconds.
         * @defaultValue 1000
         */
        syncInterestLifetime?: number;
        /**
         * Interval between sync Interests, randomized within the range, in milliseconds.
         * @defaultValue `[syncInterestLifetime/2+100,syncInterestLifetime/2+500]`
         */
        syncInterestInterval?: [min: number, max: number];
        /**
         * Verifier of sync reply Data packets.
         * @defaultValue no verification
         */
        verifier?: Verifier;
    }
    interface TopicInfo extends PSyncCore.PrefixSeqNum {
    }
    class StateEvent extends Event {
        readonly topics: readonly TopicInfo[];
        constructor(type: string, topics: readonly TopicInfo[]);
    }
}

declare const PointSizes: {
    readonly "P-256": 32;
    readonly "P-384": 48;
    readonly "P-521": 66;
};

/** Pretty-print TLV-TYPE number. */
declare function printTT(tlvType: number): string;

/** Named private key. */
declare type PrivateKey = Key<"private">;

/** A running producer. */
declare interface Producer extends Disposable {
    /**
     * Prefix specified in {@link Endpoint.produce} call.
     * Additional prefixes can be added via `.face.addRoute()`.
     */
    readonly prefix: Name | undefined;
    /** Logical forwarder face for this producer. */
    readonly face: FwFace;
    /** Outgoing Data buffer. */
    readonly dataBuffer?: DataBuffer;
    /**
     * Process an Interest received elsewhere.
     *
     * @remarks
     * Use case of this function:
     * 1. Producer A dynamically creates producer B upon receiving an Interest.
     * 2. Producer A can invoke this function to let producer B generate a response.
     * 3. The response should be sent by producer A.
     */
    processInterest: (interest: Interest) => Promise<Data | undefined>;
    /** Close the producer. */
    close: () => void;
}

/**
 * Producer handler function.
 * @param interest - Incoming Interest.
 * @param producer - Producer context.
 *
 * @remarks
 * The handler may be invoked concurrently up to {@link ProducerOptions.concurrency} instances.
 * The handler should return a Promise that resolves to:
 * - Data satisfying the Interest: send Data to consumer(s).
 *   - If Data is not signed, it is signed with {@link ProducerOptions.dataSigner}.
 * - Data that does not satisfy the Interest or `undefined`:
 *   - {@link ProducerOptions.dataBuffer} is unset: cause a timeout.
 *   - {@link ProducerOptions.dataBuffer} is provided: query the DataBuffer.
 */
declare type ProducerHandler = (interest: Interest, producer: Producer) => Promise<Data | undefined>;

/** {@link Endpoint.produce} options. */
declare interface ProducerOptions {
    /**
     * Description for debugging purpose.
     * @defaultValue
     * "produce" + prefix.
     */
    describe?: string;
    /** AbortSignal that allows closing the producer via AbortController. */
    signal?: AbortSignal;
    /**
     * Whether routes registered by producer would cause `@ndn/fw` internal FIB to stop matching
     * toward shorter prefixes.
     * @defaultValue `true`
     *
     * @remarks
     * If all nexthops of a FIB entry are set to non-capture, FIB lookup may continue onto nexthops
     * on FIB entries with shorter prefixes. One use case is in dataset synchronization protocols,
     * where both local and remote sync participants want to receive each other's Interests.
     */
    routeCapture?: boolean;
    /**
     * What name to be readvertised.
     * Ignored if prefix is `undefined`.
     */
    announcement?: FwFace.RouteAnnouncement;
    /**
     * How many Interests to process in parallel.
     * @defaultValue 1
     */
    concurrency?: number;
    /**
     * If specified, automatically sign Data packets that are not yet signed.
     *
     * @remarks
     * If the {@link ProducerHandler} returns a Data packet that is not signed (its SigType is
     * *Null*), it is automatically signed with this signer.
     *
     * This option does not apply to Data packets manually inserted into `.dataBuffer`. To auto-sign
     * those packet, specify {@link DataStoreBuffer.Options.dataSigner} in addition.
     */
    dataSigner?: Signer;
    /**
     * Outgoing Data buffer.
     *
     * @remarks
     * Providing an outgoing Data buffer allows the {@link ProducerHandler} to prepare multiple Data
     * packets in response to one Interest, in which one Data satisfies the current Interest and
     * additional Data satisfy upcoming Interest. This is useful for a producer that generates a
     * multi-segment response triggered by a single Interest, such as a
     * {@link https://redmine.named-data.net/projects/nfd/wiki/StatusDataset | StatusDataset}
     * producer in NFD Management protocol.
     *
     * The producer can prepare the Data packets and insert them to the DataBuffer, and then return
     * `undefined`, so that the Interest is used to query the DataBuffer and the first matching Data
     * is sent. The producer can also return a specify Data packet to satisfy the current Interest.
     */
    dataBuffer?: DataBuffer;
    /**
     * Whether to add handler return value to `.dataBuffer`.
     * @defaultValue `true`
     *
     * @remarks
     * This is only relevant when `.dataBuffer` is set. If `true`, when the {@link ProducerHandler}
     * returns a Data packet, it is automatically inserted to the DataBuffer.
     */
    autoBuffer?: boolean;
}

/**
 Create a type that represents either the value or the value wrapped in `PromiseLike`.

 Use-cases:
 - A function accepts a callback that may either return a value synchronously or may return a promised value.
 - This type could be the return type of `Promise#then()`, `Promise#catch()`, and `Promise#finally()` callbacks.

 Please upvote [this issue](https://github.com/microsoft/TypeScript/issues/31394) if you want to have this type as a built-in in TypeScript.

 @example
 ```
 import type {Promisable} from 'type-fest';

 async function logger(getLogEntry: () => Promisable<string>): Promise<void> {
 	const entry = await getLogEntry();
 	console.log(entry);
 }

 logger(() => 'foo');
 logger(() => Promise.resolve('bar'));
 ```

 @category Async
 */
declare type Promisable<T> = T | PromiseLike<T>;

declare class ProviderBrowser implements ForwardingProvider {
    readonly LOG_INTERESTS = false;
    readonly BROWSER = 1;
    topo: Topology;
    pendingUpdatesNodes: {
        [id: string]: Partial<INode>;
    };
    pendingUpdatesEdges: {
        [id: string]: Partial<IEdge>;
    };
    defaultLatency: number;
    defaultLoss: number;
    contentStoreSize: number;
    latencySlowdown: number;
    private scheduledRouteRefresh;
    constructor();
    initialize: () => Promise<void>;
    private loadDumpUrl;
    private loadTestbedTopology;
    private loadDefaultTopology;
    initializePostNetwork: () => Promise<void>;
    edgeUpdated: (edge?: IEdge) => Promise<void>;
    nodeUpdated: (node?: INode) => Promise<void>;
    onNetworkClick: () => Promise<void>;
    sendPingInterest(from: INode, to: INode): void;
    sendInterest(name: string, node: INode): void;
    runCode(code: string, node: INode): Promise<void>;
    /** Schedule a refresh of static routes */
    scheduleRouteRefresh: () => void;
    /** Compute static routes */
    private computeRoutes;
    /** Ensure all nodes and edges are initialized */
    private ensureInitialized;
    downloadExperimentDump(): void;
    loadExperimentDump(): Promise<void>;
    loadExperimentDumpFromBin(val: ArrayBuffer): void;
}

declare class PSyncCodec {
    protected readonly ibltParams: IBLT.PreparedParameters;
    constructor(p: PSyncCodec.Parameters, ibltParams: IBLT.PreparedParameters);
    state2buffer(state: PSyncCore.State): Uint8Array;
    buffer2state(buffer: Uint8Array): PSyncCore.State;
}

declare interface PSyncCodec extends Readonly<PSyncCodec.Parameters>, IbltCodec {
}

declare namespace PSyncCodec {
    type Compression = Compression;
    interface Parameters {
        /** Compression method for IBLT in name component. */
        ibltCompression: Compression;
        /** Compression method for State in segmented object. */
        contentCompression: Compression;
        /** Encode State to buffer (without compression). */
        encodeState: (state: PSyncCore.State) => Uint8Array;
        /** Decode State from buffer (without decompression). */
        decodeState: (payload: Uint8Array) => PSyncCore.State;
        /** Convert a name prefix to a Bloom filter key. */
        toBloomKey: (prefix: Name) => string | Uint8Array;
        /** Number of name components in an encoded Bloom filter. */
        encodeBloomLength: number;
        /** Encode a Bloom filter. */
        encodeBloom: (bf: BloomFilter) => Component[];
        /** Decode a Bloom filter. */
        decodeBloom: (Bloom: typeof BloomFilter, comps: readonly Component[]) => Promise<BloomFilter>;
    }
}

declare class PSyncCore {
    constructor(p: PSyncCore.Parameters);
    readonly ibltParams: IBLT.PreparedParameters;
    readonly threshold: number;
    readonly joinPrefixSeqNum: (ps: PSyncCore.PrefixSeqNum) => PSyncCore.PrefixSeqNumEncoded;
    readonly nodes: NameMap<PSyncNode>;
    readonly keys: Map<number, PSyncNode>;
    readonly iblt: IBLT;
    get(prefix: Name): PSyncNode | undefined;
    add(prefix: Name): PSyncNode;
    list(filter: (node: PSyncNode) => boolean): PSyncCore.State;
    onIncreaseSeqNum?: (node: PSyncNode, prevSeqNum: number, prevKey: number) => void;
}

declare namespace PSyncCore {
    interface PrefixSeqNum {
        prefix: Name;
        seqNum: number;
    }
    type State = PrefixSeqNum[];
    interface PrefixSeqNumEncoded {
        readonly value: Uint8Array;
        readonly hash: number;
    }
    interface Parameters {
        iblt: IBLT.Parameters;
        /** If IBLT diff has at least this number of entries, respond with SyncData right away. */
        threshold: number;
        /** Encode prefix and sequence number to byte array. */
        joinPrefixSeqNum: (ps: PrefixSeqNum) => PrefixSeqNumEncoded;
    }
}

declare class PSyncNode implements SyncNode<Name>, PSyncCore.PrefixSeqNum {
    private readonly c;
    readonly id: Name;
    constructor(c: PSyncCore, id: Name);
    get prefix(): Name;
    get key(): number;
    private seq;
    private k;
    get seqNum(): number;
    set seqNum(v: number);
    /**
     * Change sequence number, for internal use.
     * @param v - New sequence number.
     * @param triggerEvent - Whether to trigger `.onIncreaseSeqNum` callback.
     */
    setSeqNum(v: number, triggerEvent?: boolean): void;
    remove(): void;
    /** Recompute `.k` after changing sequence number. */
    private updateKey;
    private detachKey;
}

/** Use zlib compression with PSync. */
declare const PSyncZlib: PSyncCodec.Compression;

declare interface PublicFields extends Except<Fields_2, "paramsPortion" | "signedPortion"> {
}

declare interface PublicFields_2 extends Except<Fields, "signedPortion" | "topTlv" | "topTlvDigest"> {
}

/** Named public key. */
declare type PublicKey = Key<"public">;

/** An iterable that you can push values into. */
declare interface Pushable<T> extends AsyncIterable<T> {
    /** Push a value. */
    push: (value: T) => void;
    /** End the iterable normally. */
    stop: () => void;
    /** End the iterable abnormally. */
    fail: (err: Error) => void;
}

/**
 * Create an iterable that you can push values into.
 * @typeParam T - Value type.
 * @returns AsyncIterable with push method.
 *
 * @remarks
 * Inspired by {@link https://www.npmjs.com/package/it-pushable | it-pushable} but implemented on
 * top of {@link https://www.npmjs.com/package/event-iterator | event-iterator} library.
 */
declare function pushable<T>(): Pushable<T>;

/** IV generator using all random bits. */
declare class RandomIvGen extends IvGen {
    protected generate(): Uint8Array;
}

/**
 * Create a random jitter generator function.
 * @param r - Jitter factor around 1.
 * @param x - Median value.
 * @returns Jitter generator function.
 *
 * @remarks
 * Each time the returned jitter generator function is called, it returns a number within
 * `[x*(1-r), x*(1+r)]` range. For example, `randomJitter(0.1, 2)` creates a jitter generator
 * function that returns random values within `[1.8, 2.2]` range.
 */
declare function randomJitter(r: number, x?: number): () => number;

/** Indicate an Interest has been rejected. */
declare class RejectInterest implements FwPacket<Interest> {
    reject: RejectInterest.Reason;
    l3: Interest;
    token?: unknown;
    constructor(reject: RejectInterest.Reason, l3: Interest, token?: unknown);
}

declare namespace RejectInterest {
    type Reason = "cancel" | "expire";
}

/** Reorder items according to their index numbers. */
declare class Reorder<T> {
    private next;
    private readonly buffer;
    constructor(first?: number);
    /** Return number of items in buffer. */
    get size(): number;
    /** Determine whether buffer is empty, i.e. all items emitted. */
    get empty(): boolean;
    /** Add a new item. */
    push(index: number, obj: T): void;
    /** Return and remove in-order items. */
    shift(): T[];
}

/**
 * Function to generate retransmission intervals.
 *
 * @remarks
 * The generator function is invoked once for each Interest. It should generate successive retx
 * intervals for the given Interest, based on the policy it represents. When the generator ends
 * (no more values from the returned iterable), no more retx is allowed.
 */
declare type RetxGenerator = (interestLifetime: number) => Iterable<number>;

/** Interest retransmission policy options. */
declare interface RetxOptions {
    /**
     * Maximum number of retransmissions, excluding initial Interest.
     * @defaultValue
     * `0`, which disables retransmissions
     */
    limit?: number;
    /**
     * Initial retx interval
     * @defaultValue
     * 50% of InterestLifetime
     */
    interval?: number;
    /**
     * Randomize retx interval within [1-randomize, 1+randomize].
     * @defaultValue `0.1`
     *
     * @remarks
     * Suppose this is set to `0.1`, an interval of 100ms would become `[90ms,110ms]`.
     */
    randomize?: number;
    /**
     * Multiply retx interval by backoff factor after each retx.
     * @defaultValue `1.0`
     *
     * @remarks
     * Valid range is `[1.0, 2.0]`.
     */
    backoff?: number;
    /**
     * Maximum retx interval.
     * @defaultValue
     * 90% of InterestLifetime
     */
    max?: number;
}

/**
 * Interest retransmission policy.
 *
 * @remarks
 * A number is interpreted as {@link RetxOptions.limit} with other options at their defaults.
 * Set `0` to disable retransmissions.
 */
declare type RetxPolicy = RetxOptions | RetxGenerator | number;

/** Sha256WithRsa signing algorithm. */
declare const RSA: SigningAlgorithm<{}, true, RSA.GenParams>;

declare namespace RSA {
    interface GenParams {
        modulusLength?: RsaModulusLength;
        /** Import PKCS#8 private key and SPKI public key instead of generating. */
        importPkcs8?: [pkcs8: Uint8Array, spki: Uint8Array];
    }
}

declare type RsaModulusLength = (typeof RsaModulusLength.Choices)[number];

declare namespace RsaModulusLength {
    const Default: RsaModulusLength;
    const Choices: readonly [2048, 4096];
}

/** RSA-OAEP encryption algorithm. */
declare const RSAOAEP: EncryptionAlgorithm<{}, true, RSA.GenParams>;

declare interface Rule {
    update: (si: SigInfo, state: KeyState) => void;
    check: (si: SigInfo, state: KeyState) => () => void;
}

/**
 * Yield all values from an iterable but catch any error.
 * @param iterable - Input iterable.
 * @param onError - Callback to receive errors thrown by the iterable.
 * @returns Iterable that does not throw errors.
 */
declare function safeIter<T>(iterable: AnyIterable<T>, onError?: (err?: unknown) => void): AsyncIterableIterator<T>;

/** Named secret key. */
declare type SecretKey = Key<"secret">;

declare class Semaphore {
    #private;
    count: number;
    constructor(count: number);
    acquire(): Promise<() => void>;
    use<T>(f: () => Promise<T>): Promise<T>;
}

/** Compute SHA256 digest. */
declare function sha256(input: Uint8Array): Promise<Uint8Array>;

/** SignatureInfo on Interest or Data. */
declare class SigInfo {
    static decodeFrom(decoder: Decoder): SigInfo;
    /**
     * Construct from flexible arguments.
     *
     * Arguments can include, in any order:
     * - {@link SigInfo} to copy from
     * - number as SigType
     * - {@link KeyLocator}, or Name/URI/KeyDigest to construct KeyLocator
     * - {@link SigInfo.Nonce}`(v)`
     * - {@link SigInfo.Time}`(v)`
     * - {@link SigInfo.SeqNum}`(v)`
     */
    constructor(...args: SigInfo.CtorArg[]);
    type: number;
    keyLocator?: KeyLocator;
    nonce?: Uint8Array;
    time?: number;
    seqNum?: bigint;
    readonly [Extensible.TAG]: ExtensionRegistry<SigInfo>;
    /**
     * Create an Encodable.
     * @param tt - Either `TT.ISigInfo` or `TT.DSigInfo`.
     */
    encodeAs(tt: number): EncodableObj;
    private encodeTo;
}

declare namespace SigInfo {
    /** Constructor argument to set SigNonce field. */
    function Nonce(v?: Uint8Array | number): CtorTag;
    /** Generate a random nonce. */
    function generateNonce(size?: number): Uint8Array;
    /** Constructor argument to set SigTime field. */
    function Time(v?: number): CtorTag;
    /** Constructor argument to set SigSeqNum field. */
    function SeqNum(v: bigint): CtorTag;
    /** Constructor argument. */
    type CtorArg = SigInfo | number | KeyLocator.CtorArg | CtorTag;
    /** Add an extension TLV in SigInfo. */
    const registerExtension: <R>(ext: Extension<SigInfo, R>) => void;
    const registerExtensionWithStructFieldType: <R>(tt: number, type: {
        decode: (this: void, tlv: Decoder.Tlv) => R;
        encode: (this: void, value: R) => Encodable;
    }, { order }?: ExtensionOptions | undefined) => void;
    /** Remove an extension TLV in SigInfo. */
    const unregisterExtension: (tt: number) => void;
}

/** Validation policy for SigInfo fields in signed Interest. */
declare class SignedInterestPolicy {
    private readonly owned;
    private readonly trackedKeys;
    private readonly records;
    private readonly rules;
    /**
     * Constructor.
     * @param opts - Options.
     * @param rules -
     *  One or more rules created from {@link SignedInterestPolicy.Nonce},
     *  {@link SignedInterestPolicy.Time}, {@link SignedInterestPolicy.SeqNum}.
     */
    constructor(opts: SignedInterestPolicy.Options, ...rules: Rule[]);
    /**
     * Constructor.
     * @param rules -
     *  One or more rules created from {@link SignedInterestPolicy.Nonce},
     *  {@link SignedInterestPolicy.Time}, {@link SignedInterestPolicy.SeqNum}.
     */
    constructor(...rules: Rule[]);
    /**
     * Assign SigInfo fields on an Interest before signing.
     * @param key - Signing key object to associate state with; if omitted, use global state.
     */
    update(interest: Interest, key?: object): void;
    /**
     * Check SigInfo of an Interest.
     * @returns A function to save state after the Interest has passed all verifications.
     */
    check({ sigInfo }: Interest): () => void;
    /**
     * Wrap an Interest to update/check SigInfo during signing/verification.
     *
     * @remarks
     * During signing, global state is being used because signer key cannot be detected.
     */
    wrapInterest(interest: Interest): Signer.Signable & Verifier.Verifiable;
    /**
     * Wrap a Signer to update SigInfo when signing an Interest.
     *
     * @remarks
     * State is associated with the provided Signer.
     */
    makeSigner(inner: Signer): Signer;
    /** Wrap a Verifier to check the policy when verifying an Interest. */
    makeVerifier(inner: Verifier, { passData, passUnsignedInterest, }?: SignedInterestPolicy.WrapOptions): Verifier;
}

declare namespace SignedInterestPolicy {
    /** Constructor options. */
    interface Options {
        /**
         * How many distinct public keys to keep track.
         * Each different KeyLocator Name or KeyDigest is tracked separately.
         * @defaultValue 256
         *
         * @remarks
         * Minimum is 1.
         */
        trackedKeys?: number;
    }
    /** {@link SignedInterestPolicy.makeVerifier} options. */
    interface WrapOptions {
        /**
         * If true, non-Interest packets are passed through to the inner Verifier.
         * If false, non-Interest packets are rejected.
         * @defaultValue true
         */
        passData?: boolean;
        /**
         * If true, Interests without SigInfo are passed through to the inner Verifier.
         * If false, Interests without SigInfo are rejected.
         * @defaultValue false
         */
        passUnsignedInterest?: boolean;
    }
    /** {@link SignedInterestPolicy.Nonce} options. */
    interface NonceOptions {
        /**
         * Length of generated SigNonce.
         * @defaultValue 8
         *
         * @remarks
         * Minimum is 1.
         */
        nonceLength?: number;
        /**
         * Minimum required length of SigNonce.
         * @defaultValue 8
         *
         * @remarks
         * Minimum is 1.
         */
        minNonceLength?: number;
        /**
         * How many distinct SigNonce values to keep track, within each public key.
         * @defaultValue 256
         *
         * @remarks
         * Minimum is 1.
         */
        trackedNonces?: number;
    }
    /**
     * Create a rule to assign or check SigNonce.
     *
     * @remarks
     * This rule assigns a random SigNonce of `nonceLength` octets that does not duplicate
     * last `trackedNonces` values.
     *
     * This rule rejects an Interest on any of these conditions:
     * - SigNonce is absent.
     * - SigNonce has fewer than `minNonceLength` octets.
     * - SigNonce value duplicates any of last `trackedNonces` values.
     */
    function Nonce(opts?: NonceOptions): Rule;
    /** {@link SignedInterestPolicy.Time} options. */
    interface TimeOptions {
        /**
         * Maximum allowed clock offset in milliseconds.
         * @defaultValue 60000
         *
         * @remarks
         * Minimum is 0. However, setting to 0 is inadvisable because it would require consumer and
         * producer to have precisely synchronized clocks.
         */
        maxClockOffset?: number;
    }
    /**
     * Create a rule to assign or check SigTime.
     *
     * @remarks
     * This rule assigns SigTime to be same as current timestamp, but may increment if it
     * duplicates the previous value.
     *
     * This rule rejects an Interest on any of these conditions:
     * - SigTime is absent.
     * - SigTime differs from current timestamp by more than `maxClockOffset` milliseconds.
     * - SigTime value is less than or equal to a previous value.
     *
     * This check logic differs from NDN Packet Format v0.3 specification (as of 2020-September) in
     * that `maxClockOffset` is checked on every Interest rather than only the "initial" Interest.
     * It is the same behavior as ndn-cxx v0.7.1 implementation.
     * This logic offers better consistency as it has less dependency on internal state of the
     * SignedInterestPolicy. However, persistently sending more than 1000 signed Interests per second
     * would eventually push SigTime out of `maxClockOffset` range and cause rejections.
     */
    function Time(opts?: TimeOptions): Rule;
    /** {@link SignedInterestPolicy.SeqNum} options. */
    interface SeqNumOptions {
        /**
         * Initial sequence number.
         * @defaultValue 0n
         */
        initialSeqNum?: bigint;
    }
    /**
     * Create a rule to assign or check SigSeqNum.
     *
     * @remarks
     * This rule assigns SigSeqNum to `initialSegNum`, or increments from previous value.
     *
     * This rule rejects an Interest on any of these conditions:
     * - SigSeqNum is absent.
     * - SigSeqNum value is less than or equal to a previous value.
     */
    function SeqNum(opts?: SeqNumOptions): Rule;
}

/** High level signer, such as a named private key. */
declare interface Signer {
    /** Sign a packet. */
    sign: (pkt: Signer.Signable) => Promise<void>;
}

declare namespace Signer {
    /** Target packet compatible with high level signer. */
    interface Signable extends PacketWithSignature, LLSign.Signable {
    }
    /**
     * Put SigInfo on packet if it does not exist.
     * @param pkt - Target packet.
     * @param sigType - Optionally set sigType.
     * @param keyLocator - Optionally set keyLocator; `false` to delete KeyLocator.
     * @returns Existing or modified SigInfo.
     */
    function putSigInfo(pkt: PacketWithSignature, sigType?: number, keyLocator?: KeyLocator.CtorArg | false): SigInfo;
    /**
     * Create a Signer that signs a packet only if it does not already have a non-Null signature.
     * @param signer - Inner signer.
     */
    function onlyIfUnsigned(signer: Signer): Signer;
}

/**
 * WebCrypto based signing algorithm implementation.
 * @typeParam I - Algorithm-specific per-key information.
 * @typeParam Asym - Whether the algorithm is asymmetric.
 * @typeParam G - Key generation parameters.
 */
declare interface SigningAlgorithm<I = any, Asym extends boolean = any, G = any> extends CryptoAlgorithm<I, Asym, G> {
    /** SigInfo.sigType number for signatures produced by this algorithm. */
    readonly sigType: number;
    /**
     * Create a low level signing function from private key (in asymmetric algorithm) or
     * secret key (in symmetric algorithm).
     */
    makeLLSign: If<Asym, (key: CryptoAlgorithm.PrivateKey<I>) => LLSign, (key: CryptoAlgorithm.SecretKey<I>) => LLSign, unknown>;
    /**
     * Create a low level verification function from public key (in asymmetric algorithm) or
     * secret key (in symmetric algorithm).
     */
    makeLLVerify: If<Asym, (key: CryptoAlgorithm.PublicKey<I>) => LLVerify, (key: CryptoAlgorithm.SecretKey<I>) => LLVerify, unknown>;
}

/**
 * A full list of signing algorithms.
 *
 * @remarks
 * The *full* list contains all implemented algorithms.
 * This list currently contains {@link ECDSA}, {@link RSA}, {@link HMAC}, and {@link Ed25519}.
 *
 * This can be used in place of {@link SigningAlgorithmListSlim} to support more algorithms,
 * at the cost of larger bundle size. If you know exactly which algorithms are needed, you can
 * also explicitly import them and form an array.
 */
declare const SigningAlgorithmListFull: readonly SigningAlgorithm[];

/**
 * A slim list of signing algorithms.
 *
 * @remarks
 * The *slim* list contains only the most commonly used algorithms, to reduce bundle size.
 * This list currently contains {@link ECDSA}.
 * If you need more algorithms, explicitly import them or use {@link SigningAlgorithmListFull}.
 */
declare const SigningAlgorithmListSlim: readonly SigningAlgorithm[];

declare type SigningOptG<I, Asym extends boolean, G> = {} extends G ? [
SigningAlgorithm<I, Asym, G>,
G?
] : [
SigningAlgorithm<I, Asym, G>,
G
];

declare const SigType: {
    readonly Sha256: 0;
    readonly Sha256WithRsa: 1;
    readonly Sha256WithEcdsa: 3;
    readonly HmacWithSha256: 4;
    readonly Ed25519: 5;
    readonly Null: 200;
};

/**
 Useful to flatten the type output to improve type hints shown in editors. And also to transform an interface into a type to aide with assignability.

 @example
 ```
 import type {Simplify} from 'type-fest';

 type PositionProps = {
 	top: number;
 	left: number;
 };

 type SizeProps = {
 	width: number;
 	height: number;
 };

 // In your editor, hovering over `Props` will show a flattened object with all the properties.
 type Props = Simplify<PositionProps & SizeProps>;
 ```

 Sometimes it is desired to pass a value as a function argument that has a different type. At first inspection it may seem assignable, and then you discover it is not because the `value`'s type definition was defined as an interface. In the following example, `fn` requires an argument of type `Record<string, unknown>`. If the value is defined as a literal, then it is assignable. And if the `value` is defined as type using the `Simplify` utility the value is assignable.  But if the `value` is defined as an interface, it is not assignable because the interface is not sealed and elsewhere a non-string property could be added to the interface.

 If the type definition must be an interface (perhaps it was defined in a third-party npm package), then the `value` can be defined as `const value: Simplify<SomeInterface> = ...`. Then `value` will be assignable to the `fn` argument.  Or the `value` can be cast as `Simplify<SomeInterface>` if you can't re-declare the `value`.

 @example
 ```
 import type {Simplify} from 'type-fest';

 interface SomeInterface {
 	foo: number;
 	bar?: string;
 	baz: number | undefined;
 }

 type SomeType = {
 	foo: number;
 	bar?: string;
 	baz: number | undefined;
 };

 const literal = {foo: 123, bar: 'hello', baz: 456};
 const someType: SomeType = literal;
 const someInterface: SomeInterface = literal;

 function fn(object: Record<string, unknown>): void {}

 fn(literal); // Good: literal object type is sealed
 fn(someType); // Good: type is sealed
 fn(someInterface); // Error: Index signature for type 'string' is missing in type 'someInterface'. Because `interface` can be re-opened
 fn(someInterface as Simplify<SomeInterface>); // Good: transform an `interface` into a `type`
 ```

 @link https://github.com/microsoft/TypeScript/issues/15300

 @category Object
 */
declare type Simplify<T> = {[KeyType in keyof T]: T[KeyType]} & {};

/** SVS state vector. */
declare class StateVector {
    /**
     * Constructor.
     * @param from - Copy from state vector or its JSON value.
     */
    constructor(from?: StateVector | Record<string, number>);
    private readonly m;
    /** Get sequence number of a node. */
    get(id: Name): number;
    /**
     * Set sequence number of a node.
     *
     * @remarks
     * Setting to zero removes the node.
     */
    set(id: Name, seqNum: number): void;
    /** Iterate over nodes and their sequence numbers. */
    [Symbol.iterator](): IterableIterator<[id: Name, seqNum: number]>;
    private iterOlderThan;
    /** List nodes with older sequence number in this state vector than other. */
    listOlderThan(other: StateVector): StateVector.DiffEntry[];
    /** Update this state vector to have newer sequence numbers between this and other. */
    mergeFrom(other: StateVector): void;
    /** Serialize as JSON. */
    toJSON(): Record<string, number>;
    /** Encode TLV-VALUE of name component. */
    encodeTo(encoder: Encoder): void;
    /** Encode to name component. */
    toComponent(): Component;
    /** Decode TLV-VALUE of name component. */
    static decodeFrom(decoder: Decoder): StateVector;
    /** Decode from name component. */
    static fromComponent(comp: Component): StateVector;
}

declare namespace StateVector {
    /** TLV-TYPE of name component. */
    const NameComponentType: 201;
    interface DiffEntry {
        id: Name;
        loSeqNum: number;
        hiSeqNum: number;
    }
}

/**
 * KV store where each key is a Name.
 *
 * @remarks
 * Function calls are serialized. This does not have to be thread safe.
 */
declare abstract class StoreBase<T> {
    private readonly provider;
    constructor(provider: StoreProvider<T>);
    get canSClone(): boolean;
    /** List item names. */
    list(): Promise<Name[]>;
    /** Erase item by name. */
    erase(name: Name): Promise<void>;
    protected getValue(name: Name): Promise<T>;
    protected insertValue(name: Name, value: T): Promise<void>;
    protected bufferToStorable(input: Uint8Array | string): Uint8Array | string;
}

declare namespace StoreBase {
    function bufferFromStorable(input: Uint8Array | string): Uint8Array;
}

declare interface StoredCert {
    certBuffer: Uint8Array | string;
}

/**
 * KV store provider where each key is a string.
 *
 * @remarks
 * Function calls are serialized. This does not have to be thread safe.
 */
declare interface StoreProvider<T> {
    /**
     * Indicate whether the store provider supports the structured clone algorithm.
     * If false, values must be JSON serializable.
     */
    readonly canSClone: boolean;
    /** List keys. */
    list: () => Promisable<string[]>;
    /** Retrieve value by key. */
    get: (key: string) => Promisable<T>;
    /** Insert key and value. */
    insert: (key: string, value: T) => Promisable<void>;
    /** Erase key. */
    erase: (key: string) => Promisable<void>;
}

/**
 * Helper to build a base class that represents a TLV structure.
 *
 * @remarks
 * StructBuilder allows you to define the typing, constructor, encoder, and decoder, while writing
 * each field only once. It is only compatible with a subset of TLV structures. Namely, the TLV
 * structure shall contain a sequence of sub-TLV elements with distinct TLV-TYPE numbers, where
 * each sub-TLV-TYPE may appear zero, one, or multiple times.
 *
 * To use StructBuilder, calling code should follow these steps:
 * 1. Invoke `.add()` method successively to define sub-TLV elements.
 * 2. Obtain a base class via `.baseClass()` method, which contains one field for each sub-TLV-TYPE
 *    as defined, along with constructor, encoding, and decoding functions.
 * 3. Declare a subclass deriving from this base class, to add more functionality.
 * 4. Assign the subclass constructor to `.subclass` property of the builder.
 */
declare class StructBuilder<U extends {}> {
    readonly typeName: string;
    readonly topTT?: number | undefined;
    /**
     * Constructor.
     * @param typeName - Type name, used in error messages.
     * @param topTT - If specified, encode as complete TLV; otherwise, encode as TLV-VALUE only.
     */
    constructor(typeName: string, topTT?: number | undefined);
    /**
     * Subclass constructor.
     * This must be assigned, otherwise decoding function will not work.
     */
    subclass?: Constructor<U, []>;
    private readonly fields;
    private readonly flagBits;
    private readonly EVD;
    /** Return field names. */
    get keys(): string[];
    /**
     * Add a field.
     * @param tt - TLV-TYPE number.
     * @param key - Field name on the base class.
     * @param type - Field type.
     * @param opts - Field options.
     * @returns StructBuilder annotated with field typing.
     */
    add<T, K extends string, Required extends boolean = false, Repeat extends boolean = false, FlagPrefix extends string = K, FlagBit extends string = never>(tt: number, key: ValidateOptions<T, Repeat, FlagBit, K>, type: StructFieldType<T>, opts?: Options<Required, Repeat, FlagPrefix, FlagBit>): StructBuilder<Simplify<U & AddField<K, T, Required, Repeat> & AddFlags<FlagPrefix, FlagBit>>>;
    /** Change IsCritical on the EvDecoder. */
    setIsCritical(cb: EvDecoder.IsCritical): this;
    /**
     * Obtain a base class for the TLV structure class.
     * @typeParam S - Subclass type.
     */
    baseClass<S>(): (new () => Simplify<U> & EncodableObj) & Decodable<S>;
}

/**
 * StructBuilder field type of raw bytes.
 *
 * @remarks
 * The field is defined as Uint8Array.
 * If the field is required, it is initialized as an empty Uint8Array.
 */
declare const StructFieldBytes: StructFieldType<Uint8Array>;

/**
 * StructBuilder field type of {@link Component}, where Component TLV is nested in an outer TLV.
 *
 * @remarks
 * Data.FinalBlockId is an example where this might be used.
 */
declare const StructFieldComponentNested: StructFieldType<Component>;

/**
 * Declare a StructBuilder field type of non-negative integer from an enum.
 * @param Enum - A flat (not OR'ed flags) enum type.
 *
 * @remarks
 * The field is defined as a flat enum type.
 * If the field is required, it is initialized as zero.
 */
declare function StructFieldEnum<E extends number>(Enum: Record<number, string>): StructFieldType<E>;

/**
 * StructBuilder field type of {@link Name}, where Name TLV is placed into the structure directly.
 *
 * @remarks
 * Example ABNF structure where this can be used:
 * ```abnf
 *  MyType = MY-TYPE-TYPE TLV-LENGTH
 *             OtherTLV
 *             Name
 *             OtherTLV
 * ```
 *
 * The field is defined as `Name`.
 * If the field is required, it is initialized as an empty Name.
 */
declare const StructFieldName: StructFieldType<Name>;

/**
 * StructBuilder field type of {@link Name}, where Name TLV is nested in an outer TLV.
 *
 * @remarks
 * Example ABNF structure where this can be used:
 * ```abnf
 *  MyType = MY-TYPE-TYPE TLV-LENGTH
 *             OtherTLV
 *             NestedTLV
 *             OtherTLV
 *  NestedTLV = NESTED-TLV-TYPE TLV-LENGTH
 *                Name
 * ```
 *
 * The field is defined as `Name`.
 * If the field is required, it is initialized as an empty Name.
 */
declare const StructFieldNameNested: StructFieldType<Name>;

/**
 * StructBuilder field type of non-negative integer.
 *
 * @remarks
 * The field is defined as number.
 * If the field is required, it is initialized as zero.
 */
declare const StructFieldNNI: StructFieldType<number>;

/**
 * StructBuilder field type of non-negative integer.
 *
 * @remarks
 * The field is defined as bigint.
 * If the field is required, it is initialized as zero.
 */
declare const StructFieldNNIBig: StructFieldType<bigint>;

/**
 * Infer fields of a class built by StructBuilder.
 * @typeParam B - StructBuilder annotated with field typing.
 */
declare type StructFields<B extends StructBuilder<{}>> = B extends StructBuilder<infer U> ? U : never;

/**
 * StructBuilder field type of UTF-8 text.
 *
 * @remarks
 * The field is defined as string.
 * If the field is required, it is initialized as an empty string.
 */
declare const StructFieldText: StructFieldType<string>;

/**
 * StructBuilder field type.
 * @typeParam T - Value type.
 */
declare interface StructFieldType<T> {
    /**
     * Create a new value of type T.
     *
     * @remarks
     * Invoked by the TLV class constructor on each non-repeatable required field.
     */
    newValue: (this: void) => T;
    /**
     * Encode a value to sub-TLV element.
     * @returns TLV-VALUE only.
     *
     * @remarks
     * Invoked by TLV class `.encodeTo` method.
     * If the field is optional and unset, this is not invoked.
     * If the field is repeatable, this is invoked once per element.
     */
    encode: (this: void, value: T) => Encodable;
    /**
     * Decode a value from sub-TLV element.
     *
     * @remarks
     * Invoked by TLV class `.decodeFrom` method.
     * If the field is repeatable, this is invoked once per sub-TLV element.
     */
    decode: (this: void, tlv: Decoder.Tlv) => T;
    /**
     * Print a value as string representation.
     * @defaultValue
     * ```ts
     * `${value}`
     * ```
     *
     * @remarks
     * Invoked by TLV class `.toString` method.
     * If the field is optional and unset, this is not invoked.
     * If the field is repeatable, this is invoked once per element.
     */
    asString?: (this: void, value: T) => string;
}

declare namespace StructFieldType {
    /**
     * Turn a TLV class into a field type, where the TLV directly appears as the field.
     *
     * @example
     * Given this structure:
     * ```abnf
     * Outer = OUTER-TYPE TLV-LENGTH Inner
     * Inner = INNER-TYPE TLV-LENGTH INNER-VALUE
     * ```
     *
     * You can define the `Outer` builder:
     * ```ts
     * const buildOuter = new StructBuilder("Outer", TT.Outer)
     *   .add(TT.Inner, "inner", StructFieldType.wrap(Inner));
     * ```
     *
     * `Inner` type must encode itself as a TLV, and its TLV-TYPE must equal field TLV-TYPE.
     */
    function wrap<T extends NonNullable<Encodable>>(F: Constructor<T, []> & Decodable<T>, overrides?: Partial<StructFieldType<T>>): StructFieldType<T>;
    /**
     * Turn a TLV class into a field type, where the TLV is nested inside the field.
     *
     * @example
     * Given this structure:
     * ```abnf
     * Outer = OUTER-TYPE TLV-LENGTH Middle
     * Middle = MIDDLE-TYPE TLV-LENGTH Inner
     * Inner = INNER-TYPE TLV-LENGTH INNER-VALUE
     * ```
     *
     * You can define the `Outer` builder:
     * ```ts
     * const buildOuter = new StructBuilder("Outer", TT.Outer)
     *   .add(TT.Middle, "inner", StructFieldType.nest(Inner));
     * ```
     *
     * `Inner` type does not have to encode itself as a TLV. Its encoding result appears as
     * the TLV-VALUE of the "middle" field TLV.
     */
    function nest<T extends NonNullable<Encodable>>(F: Constructor<T, []> & Decodable<T>, overrides?: Partial<StructFieldType<T>>): StructFieldType<T>;
}

declare type Sub = Subscription<Name, SyncUpdate<Name>>;

/**
 * A Subject is a special type of Observable that allows values to be
 * multicasted to many Observers. Subjects are like EventEmitters.
 *
 * Every Subject is an Observable and an Observer. You can subscribe to a
 * Subject, and you can call next to feed values as well as error and complete.
 */
declare class Subject<T> extends Observable<T> implements SubscriptionLike {
    closed: boolean;
    private currentObservers;
    /** @deprecated Internal implementation detail, do not use directly. Will be made internal in v8. */
    observers: Observer<T>[];
    /** @deprecated Internal implementation detail, do not use directly. Will be made internal in v8. */
    isStopped: boolean;
    /** @deprecated Internal implementation detail, do not use directly. Will be made internal in v8. */
    hasError: boolean;
    /** @deprecated Internal implementation detail, do not use directly. Will be made internal in v8. */
    thrownError: any;
    /**
     * Creates a "subject" by basically gluing an observer to an observable.
     *
     * @nocollapse
     * @deprecated Recommended you do not use. Will be removed at some point in the future. Plans for replacement still under discussion.
     */
    static create: (...args: any[]) => any;
    constructor();
    /** @deprecated Internal implementation detail, do not use directly. Will be made internal in v8. */
    lift<R>(operator: Operator<T, R>): Observable<R>;
    next(value: T): void;
    error(err: any): void;
    complete(): void;
    unsubscribe(): void;
    get observed(): boolean;
    /**
     * Creates a new Observable with this Subject as the source. You can do this
     * to create custom Observer-side logic of the Subject and conceal it from
     * code that uses the Observable.
     * @return {Observable} Observable that the Subject casts to
     */
    asObservable(): Observable<T>;
}

/** OBSERVABLE INTERFACES */
declare interface Subscribable<T> {
    subscribe(observer: Partial<Observer<T>>): Unsubscribable;
}

/** A pubsub protocol subscriber. */
declare interface Subscriber<Topic = Name, Update extends Event = SyncUpdate<Topic>, SubscribeInfo = Topic> {
    subscribe: (topic: SubscribeInfo) => Subscription<Topic, Update>;
}

/**
 * Implements the {@link Observer} interface and extends the
 * {@link Subscription} class. While the {@link Observer} is the public API for
 * consuming the values of an {@link Observable}, all Observers get converted to
 * a Subscriber, in order to provide Subscription-like capabilities such as
 * `unsubscribe`. Subscriber is a common type in RxJS, and crucial for
 * implementing operators, but it is rarely used as a public API.
 *
 * @class Subscriber<T>
 */
declare class Subscriber_2<T> extends Subscription_2 implements Observer<T> {
    /**
     * A static factory for a Subscriber, given a (potentially partial) definition
     * of an Observer.
     * @param next The `next` callback of an Observer.
     * @param error The `error` callback of an
     * Observer.
     * @param complete The `complete` callback of an
     * Observer.
     * @return A Subscriber wrapping the (partially defined)
     * Observer represented by the given arguments.
     * @nocollapse
     * @deprecated Do not use. Will be removed in v8. There is no replacement for this
     * method, and there is no reason to be creating instances of `Subscriber` directly.
     * If you have a specific use case, please file an issue.
     */
    static create<T>(next?: (x?: T) => void, error?: (e?: any) => void, complete?: () => void): Subscriber_2<T>;
    /** @deprecated Internal implementation detail, do not use directly. Will be made internal in v8. */
    protected isStopped: boolean;
    /** @deprecated Internal implementation detail, do not use directly. Will be made internal in v8. */
    protected destination: Subscriber_2<any> | Observer<any>;
    /**
     * @deprecated Internal implementation detail, do not use directly. Will be made internal in v8.
     * There is no reason to directly create an instance of Subscriber. This type is exported for typings reasons.
     */
    constructor(destination?: Subscriber_2<any> | Observer<any>);
    /**
     * The {@link Observer} callback to receive notifications of type `next` from
     * the Observable, with a value. The Observable may call this method 0 or more
     * times.
     * @param {T} [value] The `next` value.
     * @return {void}
     */
    next(value?: T): void;
    /**
     * The {@link Observer} callback to receive notifications of type `error` from
     * the Observable, with an attached `Error`. Notifies the Observer that
     * the Observable has experienced an error condition.
     * @param {any} [err] The `error` exception.
     * @return {void}
     */
    error(err?: any): void;
    /**
     * The {@link Observer} callback to receive a valueless notification of type
     * `complete` from the Observable. Notifies the Observer that the Observable
     * has finished sending push-based notifications.
     * @return {void}
     */
    complete(): void;
    unsubscribe(): void;
    protected _next(value: T): void;
    protected _error(err: any): void;
    protected _complete(): void;
}

/**
 * A subscription on a topic.
 *
 * @remarks
 * Listen to the 'update' event to receive updates on incoming publications matching the topic.
 * Unsubscribe by disposing the subscription.
 */
declare interface Subscription<Topic = Name, Update extends Event = SyncUpdate<Topic>> extends Disposable, TypedEventTarget<Subscription.EventMap<Update>> {
    /** The topic. */
    readonly topic: Topic;
}

declare namespace Subscription {
    type EventMap<Update extends Event> = {
        /** Emitted when a subscription update is received. */
        update: Update;
    };
}

/**
 * Represents a disposable resource, such as the execution of an Observable. A
 * Subscription has one important method, `unsubscribe`, that takes no argument
 * and just disposes the resource held by the subscription.
 *
 * Additionally, subscriptions may be grouped together through the `add()`
 * method, which will attach a child Subscription to the current Subscription.
 * When a Subscription is unsubscribed, all its children (and its grandchildren)
 * will be unsubscribed as well.
 *
 * @class Subscription
 */
declare class Subscription_2 implements SubscriptionLike {
    private initialTeardown?;
    /** @nocollapse */
    static EMPTY: Subscription_2;
    /**
     * A flag to indicate whether this Subscription has already been unsubscribed.
     */
    closed: boolean;
    private _parentage;
    /**
     * The list of registered finalizers to execute upon unsubscription. Adding and removing from this
     * list occurs in the {@link #add} and {@link #remove} methods.
     */
    private _finalizers;
    /**
     * @param initialTeardown A function executed first as part of the finalization
     * process that is kicked off when {@link #unsubscribe} is called.
     */
    constructor(initialTeardown?: (() => void) | undefined);
    /**
     * Disposes the resources held by the subscription. May, for instance, cancel
     * an ongoing Observable execution or cancel any other type of work that
     * started when the Subscription was created.
     * @return {void}
     */
    unsubscribe(): void;
    /**
     * Adds a finalizer to this subscription, so that finalization will be unsubscribed/called
     * when this subscription is unsubscribed. If this subscription is already {@link #closed},
     * because it has already been unsubscribed, then whatever finalizer is passed to it
     * will automatically be executed (unless the finalizer itself is also a closed subscription).
     *
     * Closed Subscriptions cannot be added as finalizers to any subscription. Adding a closed
     * subscription to a any subscription will result in no operation. (A noop).
     *
     * Adding a subscription to itself, or adding `null` or `undefined` will not perform any
     * operation at all. (A noop).
     *
     * `Subscription` instances that are added to this instance will automatically remove themselves
     * if they are unsubscribed. Functions and {@link Unsubscribable} objects that you wish to remove
     * will need to be removed manually with {@link #remove}
     *
     * @param teardown The finalization logic to add to this subscription.
     */
    add(teardown: TeardownLogic): void;
    /**
     * Checks to see if a this subscription already has a particular parent.
     * This will signal that this subscription has already been added to the parent in question.
     * @param parent the parent to check for
     */
    private _hasParent;
    /**
     * Adds a parent to this subscription so it can be removed from the parent if it
     * unsubscribes on it's own.
     *
     * NOTE: THIS ASSUMES THAT {@link _hasParent} HAS ALREADY BEEN CHECKED.
     * @param parent The parent subscription to add
     */
    private _addParent;
    /**
     * Called on a child when it is removed via {@link #remove}.
     * @param parent The parent to remove
     */
    private _removeParent;
    /**
     * Removes a finalizer from this subscription that was previously added with the {@link #add} method.
     *
     * Note that `Subscription` instances, when unsubscribed, will automatically remove themselves
     * from every other `Subscription` they have been added to. This means that using the `remove` method
     * is not a common thing and should be used thoughtfully.
     *
     * If you add the same finalizer instance of a function or an unsubscribable object to a `Subscription` instance
     * more than once, you will need to call `remove` the same number of times to remove all instances.
     *
     * All finalizer instances are removed to free up memory upon unsubscription.
     *
     * @param teardown The finalizer to remove from this subscription
     */
    remove(teardown: Exclude<TeardownLogic, void>): void;
}

declare interface SubscriptionLike extends Unsubscribable {
    unsubscribe(): void;
    readonly closed: boolean;
}

/** SVS-PS publisher. */
declare class SvPublisher {
    constructor({ endpoint, sync, id, store, chunkSize, innerSigner, outerSigner, mappingSigner, }: SvPublisher.Options);
    private readonly node;
    private readonly nodeSyncPrefix;
    private readonly store;
    private readonly chunkOptions;
    private readonly innerSigner;
    private readonly outerSigner;
    private readonly outerProducer;
    private readonly mappingProducer;
    /** Publisher node ID. */
    get id(): Name;
    /**
     * Stop publisher operations.
     *
     * @remarks
     * This does not stop the {@link SvSync} instance or the {@link SvPublisher.DataStore}.
     */
    close(): Promise<void>;
    /**
     * Publish application data.
     * @param name - Application-specified inner name.
     * @param payload - Application payload.
     * @param entry - MappingEntry for subscriber-side filtering.
     * This is required if subscribers are expecting a certain MappingEntry subclass.
     * @returns seqNum.
     */
    publish(name: NameLike, payload: Uint8Array, entry?: MappingEntry): Promise<number>;
    private readonly handleOuter;
    private readonly handleMapping;
}

declare namespace SvPublisher {
    /**
     * Data repository used by publisher.
     *
     * @remarks
     * {@link \@ndn/repo!DataStore} satisfies the requirement.
     * Other lightweight implementations may be possible.
     */
    type DataStore = DataStore.Get & DataStore.Find & DataStore.Insert;
    interface Options {
        /**
         * Endpoint for communication.
         * @defaultValue
         * Endpoint on default logical forwarder.
         */
        endpoint?: Endpoint;
        /**
         * SvSync instance.
         *
         * @remarks
         * Multiple {@link SvSubscriber}s and {@link SvPublisher}s may reuse the same SvSync instance.
         * However, publications from a publisher cannot reach subscribers on the same SvSync instance.
         */
        sync: SvSync;
        /** Publisher node ID. */
        id: Name;
        /** Data repository used for this publisher. */
        store: DataStore;
        /**
         * Segment chunk size of inner Data packet.
         * @defaultValue 8000
         */
        chunkSize?: number;
        /**
         * Inner Data signer.
         * @defaultValue nullSigner
         */
        innerSigner?: Signer;
        /**
         * Outer Data signer.
         * @defaultValue nullSigner
         */
        outerSigner?: Signer;
        /**
         * Mapping Data signer.
         * @defaultValue nullSigner
         */
        mappingSigner?: Signer;
    }
}

/**
 * SVS-PS subscriber.
 * @typeParam ME - Subclass of MappingEntry.
 * If it is not {@link MappingEntry} base class, its constructor must be specified in
 * {@link SvSubscriber.Options.mappingEntryType}.
 */
declare class SvSubscriber<ME extends MappingEntry = MappingEntry> extends TypedEventTarget<EventMap_8> implements Subscriber<Name, SvSubscriber.Update, SvSubscriber.SubscribeInfo<ME>> {
    constructor({ endpoint, sync, retxLimit, mappingBatch, mappingEntryType, mustFilterByMapping, innerVerifier, outerVerifier, mappingVerifier, }: SvSubscriber.Options);
    private readonly abort;
    private readonly endpoint;
    private readonly syncPrefix;
    private readonly nameSubs;
    private readonly nameFilters;
    private readonly publisherSubs;
    private readonly mappingBatch;
    private readonly mappingEVD;
    private readonly mustFilterByMapping;
    private readonly innerVerifier;
    private readonly outerFetchOpts;
    private readonly outerConsumerOpts;
    private readonly mappingConsumerOpts;
    private emitError;
    /**
     * Stop subscriber operations.
     *
     * @remarks
     * This does not stop the {@link SvSync} instance.
     */
    close(): void;
    /** Subscribe to either a topic prefix or a publisher node ID. */
    subscribe(topic: SvSubscriber.SubscribeInfo<ME>): Subscription<Name, SvSubscriber.Update>;
    private readonly handleSyncUpdate;
    private retrieveMapping;
    private dispatchUpdate;
    private listNameSubs;
    private retrieveSegmented;
}

declare namespace SvSubscriber {
    interface Options {
        /**
         * Endpoint for communication.
         * @defaultValue
         * Endpoint on default logical forwarder.
         */
        endpoint?: Endpoint;
        /**
         * SvSync instance.
         * @see {@link SvPublisher.Options.sync} regarding reuse
         */
        sync: SvSync;
        /**
         * Retransmission limit for Data retrieval.
         * @defaultValue 2
         */
        retxLimit?: number;
        /**
         * Maximum quantity of MappingEntries to retrieve in a single query.
         * @defaultValue 10.
         * @see {@link https://github.com/named-data/ndn-svs/blob/e39538ed1ddd789de9a34c242af47c3ba4f3583d/ndn-svs/svspubsub.cpp#L199}
         */
        mappingBatch?: number;
        /**
         * MappingEntry constructor.
         * @defaultValue `MappingEntry` base type
         */
        mappingEntryType?: MappingEntry.Constructor;
        /**
         * If true, force the retrieval of MappingData.
         *
         * @remarks
         * When an update matches a {@link SubscribePublisher}, by default the MappingData is not
         * retrieved. Since the filter functions in {@link SubscribePrefixFilter} depend on
         * MappingEntry, they are not called, and each SubscribePrefixFilter is treated like a
         * {@link SubscribePrefix}, which would receive the message if the topic prefix matches.
         * Set this option to `true` forces the retrieval of MappingData and ensures filter functions
         * are called.
         */
        mustFilterByMapping?: boolean;
        /**
         * Inner Data verifier.
         * @defaultValue no verification
         */
        innerVerifier?: Verifier;
        /**
         * Outer Data verifier.
         * @defaultValue no verification
         */
        outerVerifier?: Verifier;
        /**
         * Mapping Data verifier.
         * @defaultValue no verification
         */
        mappingVerifier?: Verifier;
    }
    /** Subscribe parameters. */
    type SubscribeInfo<ME extends MappingEntry> = SubscribePrefix | SubscribePrefixFilter<ME> | SubscribePublisher;
    /** Subscribe to messages udner a name prefix. */
    type SubscribePrefix = Name;
    /** Subscribe to messages under a name prefix that passes a filter. */
    interface SubscribePrefixFilter<ME extends MappingEntry> {
        /** Topic prefix. */
        prefix: Name;
        /**
         * Filter function to determine whether to retrieve a message based on MappingEntry.
         * @see {@link Options.mustFilterByMapping} for limitations on when this may not be invoked.
         */
        filter: (entry: ME) => boolean;
    }
    /** Subscribe to messages from the specified publisher. */
    interface SubscribePublisher {
        publisher: Name;
    }
    /** Received update. */
    class Update extends Event {
        readonly publisher: Name;
        readonly seqNum: number;
        readonly name: Name;
        readonly payload: Uint8Array;
        constructor(publisher: Name, seqNum: number, name: Name, payload: Uint8Array);
    }
}

/** StateVectorSync participant. */
declare class SvSync extends TypedEventTarget<EventMap_7> implements SyncProtocol<Name> {
    private readonly endpoint;
    readonly describe: string;
    private readonly own;
    readonly syncPrefix: Name;
    private readonly syncInterestLifetime;
    private readonly steadyTimer;
    private readonly suppressionTimer;
    private readonly signer;
    private readonly verifier?;
    static create({ endpoint, describe, initialStateVector, initialize, syncPrefix, syncInterestLifetime, steadyTimer, suppressionTimer, signer, verifier, }: SvSync.Options): Promise<SvSync>;
    private constructor();
    private readonly maybeHaveEventListener;
    private producer?;
    /**
     * In steady state, undefined.
     * In suppression state, aggregated state vector of incoming sync Interests.
     */
    private aggregated?;
    /** Sync Interest timer. */
    private timer;
    private debug;
    close(): void;
    get(id: NameLike): SyncNode<Name>;
    add(id: NameLike): SyncNode<Name>;
    /**
     * Obtain a copy of own state vector.
     *
     * @remarks
     * This may be used as {@link SvSync.Options.initialStateVector} to re-create an SvSync instance.
     */
    get currentStateVector(): StateVector;
    /**
     * Multi-purpose callback passed to {@link SvSyncNode} constructor.
     *
     * @remarks
     * - `nodeOp(id)`: get seqNum
     * - `nodeOp(id, n)`: set seqNum, return new seqNum
     * - `nodeOp(id, 0)`: delete node during initialization
     */
    private readonly nodeOp;
    private readonly handleSyncInterest;
    private resetTimer;
    private readonly handleTimer;
    private sendSyncInterest;
}

declare namespace SvSync {
    /**
     * Timer settings.
     *
     * @remarks
     * ms: median interval in milliseconds.
     * jitter: ± percentage, in [0.0, 1.0) range.
     */
    type Timer = [ms: number, jitter: number];
    /** {@link SvSync.create} options. */
    interface Options {
        /**
         * Endpoint for communication.
         * @defaultValue
         * Endpoint on default logical forwarder.
         */
        endpoint?: Endpoint;
        /** Description for debugging purpose. */
        describe?: string;
        /**
         * Initial state vector.
         * @defaultValue empty state vector
         */
        initialStateVector?: StateVector;
        /**
         * Application initialization function.
         *
         * @remarks
         * During initialization, it's possible to remove SyncNode or decrease seqNum.
         * Calling `sync.close()` has no effect.
         *
         * Sync protocol starts running after the returned Promise is resolved.
         */
        initialize?: (sync: SvSync) => Promisable<void>;
        /** Sync group prefix. */
        syncPrefix: Name;
        /**
         * Sync Interest lifetime in milliseconds.
         * @defaultValue 1000
         */
        syncInterestLifetime?: number;
        /**
         * Sync Interest timer in steady state.
         * @defaultValue `[30000ms, ±10%]`
         */
        steadyTimer?: Timer;
        /**
         * Sync Interest timer in suppression state.
         * @defaultValue `[200ms, ±50%]`
         */
        suppressionTimer?: Timer;
        /**
         * Sync Interest signer.
         * @defaultValue nullSigner
         */
        signer?: Signer;
        /**
         * Sync Interest verifier.
         * @defaultValue no verification
         */
        verifier?: Verifier;
    }
}

declare namespace sync {
    export {
        Subscriber,
        Subscription,
        SyncNode,
        SyncProtocol,
        SyncUpdate,
        IBLT,
        makePSyncCompatParam,
        makeSyncpsCompatParam,
        PartialPublisher as PSyncPartialPublisher,
        PartialSubscriber as PSyncPartialSubscriber,
        FullSync as PSyncFull,
        PSyncZlib,
        SyncpsPubsub,
        MappingEntry as SvMappingEntry,
        StateVector as SvStateVector,
        SvPublisher,
        SvSubscriber,
        SvSync,
        TimedMappingEntry as SvTimedMappingEntry
    }
}
export { sync }

/**
 * A sync protocol node.
 * @typeParam ID - Node identifier type, typically number or Name.
 *
 * @remarks
 * Each sync protocol participant may have zero or more nodes.
 */
declare interface SyncNode<ID = any> {
    /** Node identifier. */
    readonly id: ID;
    /**
     * Current sequence number.
     *
     * @remarks
     * It can be increased, but cannot be decreased.
     */
    seqNum: number;
    /**
     * Remove this node from participating in the sync protocol.
     *
     * @remarks
     * This may or may not have effect, depending on the sync protocol.
     */
    remove: () => void;
}

/** A sync protocol participant. */
declare interface SyncProtocol<ID = any> extends TypedEventTarget<SyncProtocol.EventMap<ID>> {
    /** Stop the protocol operation. */
    close: () => void;
    /** Retrieve a node. */
    get: (id: ID) => SyncNode<ID> | undefined;
    /** Retrieve or create a node. */
    add: (id: ID) => SyncNode<ID>;
}

declare namespace SyncProtocol {
    type EventMap<ID> = {
        /** Emitted when a node is updated, i.e. has new sequence numbers. */
        update: SyncUpdate<ID>;
    };
}

declare class SyncpsCodec {
    protected readonly ibltParams: IBLT.PreparedParameters;
    constructor(p: SyncpsCodec.Parameters, ibltParams: IBLT.PreparedParameters);
}

declare interface SyncpsCodec extends Readonly<SyncpsCodec.Parameters>, IbltCodec {
}

declare namespace SyncpsCodec {
    type Compression = Compression;
    interface Parameters {
        /** Compression method for IBLT in name component. */
        ibltCompression: Compression;
        /** Compute the hash of a publication. */
        hashPub: (pub: Data) => number;
        /** Encode Content to buffer. */
        encodeContent: (pubs: readonly Data[], maxSize: number) => [wire: Uint8Array, count: number];
        /** Decode Content from buffer. */
        decodeContent: (payload: Uint8Array) => Data[];
    }
}

/** syncps - pubsub service. */
declare class SyncpsPubsub extends TypedEventTarget<EventMap_6> implements Subscriber<Name, CustomEvent<Data>> {
    constructor({ p, endpoint, describe, syncPrefix, syncInterestLifetime, syncDataPubSize, syncSigner, syncVerifier, maxPubLifetime, maxClockSkew, modifyPublication, isExpired, filterPubs, pubSigner, pubVerifier, }: SyncpsPubsub.Options);
    private readonly maybeHaveEventListener;
    private readonly endpoint;
    readonly describe: string;
    private readonly syncPrefix;
    private readonly codec;
    private closed;
    private readonly iblt;
    private readonly pubs;
    private readonly maxPubLifetime;
    private readonly maxClockSkew;
    private readonly subs;
    private readonly dModify;
    private readonly dIsExpired;
    private readonly dSigner;
    private readonly dVerifier?;
    private nOwnPubs;
    /** IBLT of own publications with callback. */
    private readonly dConfirmIblt;
    private readonly pProducer;
    private readonly pFilter;
    private readonly pPubSize;
    private readonly pPendings;
    private readonly cVerifier?;
    private readonly cLifetime;
    private cAbort?;
    private cTimer;
    private cCurrentInterestNonce?;
    private cDelivering;
    private debug;
    /** Stop the protocol operation. */
    close(): void;
    /**
     * Publish a packet.
     * @param pub - Data packet. This does not need to be signed.
     * @param cb - Callback to get notified whether publication is confirmed,
     *             i.e. its hash appears in a sync Interest from another participant.
     * @returns - Promise that resolves when the publication is recorded.
     *            It does not mean the publication has reached other participants.
     */
    publish(pub: Data, cb?: SyncpsPubsub.PublishCallback): Promise<void>;
    /** Subscribe to a topic. */
    subscribe(topic: Name): Subscription<Name, CustomEvent<Data>>;
    private handleSyncInterest;
    private processSyncInterest;
    private processPendingInterests;
    private scheduleSyncInterest;
    private sendSyncInterest;
    private isExpired;
    private addToActive;
    private invokePublishCb;
}

declare namespace SyncpsPubsub {
    interface Parameters extends SyncpsCodec.Parameters {
        iblt: IBLT.Parameters;
    }
    type ModifyPublicationCallback = (pub: Data) => void;
    /**
     * Callback to determine if a publication is expired.
     *
     * @remarks
     * The callback can return either:
     * - boolean to indicate whether the publication is expired.
     * - number, interpreted as Unix timestamp (milliseconds) of publication creation time.
     *   The publication is considered expired if this timestamp is before
     *   `NOW - (maxPubLifetime+maxClockSkew)` or after `NOW + maxClockSkew`.
     */
    type IsExpiredCallback = (pub: Data) => boolean | number;
    interface FilterPubItem {
        /** A publication, i.e. Data packet. */
        readonly pub: Data;
        /** Whether the publication is owned by the local participant. */
        readonly own: boolean;
    }
    /**
     * Callback to decide what publications to be included in a response.
     * @param items - Unexpired publications.
     * @returns A priority list of publications to be included in the response.
     */
    type FilterPubsCallback = (items: FilterPubItem[]) => FilterPubItem[];
    interface Options {
        /**
         * Algorithm parameters.
         *
         * @remarks
         * They must be the same on every peer.
         */
        p: Parameters;
        /**
         * Endpoint for communication.
         * @defaultValue
         * Endpoint on default logical forwarder.
         */
        endpoint?: Endpoint;
        /** Description for debugging purpose. */
        describe?: string;
        /** Sync group prefix. */
        syncPrefix: Name;
        /**
         * Sync Interest lifetime in milliseconds.
         * @defaultValue 4000
         */
        syncInterestLifetime?: number;
        /**
         * Advisory maximum size for publications included in a sync reply Data packet.
         * @defaultValue 1300
         */
        syncDataPubSize?: number;
        /**
         * Signer of sync reply Data packets.
         * @defaultValue digestSigning
         */
        syncSigner?: Signer;
        /**
         * Verifier of sync reply Data packets.
         * @defaultValue no verification
         */
        syncVerifier?: Verifier;
        /**
         * Publication lifetime.
         * @defaultValue 1000
         */
        maxPubLifetime?: number;
        /**
         * Maximum clock skew, for calculating timers.
         * @defaultValue 1000
         */
        maxClockSkew?: number;
        /**
         * Callback to modify publication before it's signed.
         * @defaultValue appending a TimestampNameComponent to the name
         */
        modifyPublication?: ModifyPublicationCallback;
        /**
         * Callback to determine if a publication is expired.
         *
         * @defaultValue
         * The last component is interpreted as TimestampNameComponent.
         * If it is not a TimestampNameComponent, the publication is seen as expired.
         */
        isExpired?: IsExpiredCallback;
        /**
         * Callback to decide what publications to be included in a response.
         *
         * @defaultValue
         * - Respond nothing if there's no own publication.
         * - Otherwise, prioritize own publications over others, and prioritize later timestamp.
         */
        filterPubs?: FilterPubsCallback;
        /**
         * Signer of publications.
         * @defaultValue digestSigning
         */
        pubSigner?: Signer;
        /**
         * Verifier of publications.
         * @defaultValue no verification
         */
        pubVerifier?: Verifier;
    }
    type PublishCallback = (pub: Data, confirmed: boolean) => void;
}

/** A received update regarding a node. */
declare class SyncUpdate<ID = any> extends Event {
    readonly node: SyncNode<ID>;
    readonly loSeqNum: number;
    readonly hiSeqNum: number;
    /**
     * Constructor.
     * @param node - The node.
     * @param loSeqNum - Low sequence number, inclusive.
     * @param hiSeqNum - High sequence number, inclusive.
     */
    constructor(node: SyncNode<ID>, loSeqNum: number, hiSeqNum: number, eventType?: string);
    /** Node identifier. */
    get id(): ID;
    /** Quantity of new sequence numbers. */
    get count(): number;
    /** Iterate over new sequence numbers. */
    seqNums(): Iterable<number>;
}

declare type TeardownLogic = Subscription_2 | Unsubscribable | (() => void) | void;

/** SVS-PS MappingEntry with Timestamp element. */
declare class TimedMappingEntry extends MappingEntry implements Extensible {
    constructor();
    readonly [Extensible.TAG]: ExtensionRegistry<Extensible>;
    timestamp: Date;
}

/** Timing-safe equality comparison. */
declare function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean;

declare namespace tlv {
    export {
        Decodable,
        Decoder,
        EncodableObj,
        EncodableTlv,
        Encodable,
        Encoder,
        EvDecoder,
        Extensible,
        Extension,
        ExtensionOptions,
        ExtensionRegistry,
        NNI,
        printTT,
        StructBuilder,
        StructFields,
        StructFieldEnum,
        StructFieldType,
        StructFieldNNI,
        StructFieldNNIBig,
        StructFieldText,
        StructFieldBytes
    }
}
export { tlv }

/** Convert byte array to upper-case hexadecimal string. */
declare function toHex(buf: Uint8Array): string;

declare namespace toHex {
    /** Conversion table from byte (0x00~0xFF) to upper-case hexadecimal. */
    const TABLE: Readonly<Record<number, string>>;
}

/**
 * Get key name from key name or certificate name.
 *
 * @throws Error
 * Thrown if `name` is neither a key name nor a certificate name.
 */
declare function toKeyName(name: Name): Name;

declare class Topology {
    provider: ForwardingProvider;
    readonly nodes: DataSet<INode, "id">;
    readonly edges: DataSet<IEdge, "id">;
    network: Network;
    imported?: 'MININDN' | 'BROWSER';
    busiestNode?: INode;
    busiestLink?: IEdge;
    selectedNode?: INode;
    selectedEdge?: IEdge;
    selectedPacket?: ICapturedPacket;
    captureAll: boolean;
    pendingClickEvent?: (params: any) => void;
    globalCaptureFilter: (packet: ICapturedPacket) => boolean;
    activePtys: IPty[];
    tlvTypesCode: string;
    constructor(provider: ForwardingProvider);
    /** Initialize the network */
    createNetwork: (container: HTMLElement) => Promise<void>;
    /** Update objects every animation frame */
    runAnimationFrame(): void;
    /** Handler */
    private onNetworkClick;
    /** Ensure all nodes and edges are initialized */
    private ensureInitialized;
    updateNodeColor(nodeId: IdType, nodeExtra?: INodeExtra): void;
    updateEdgeColor(edge: IEdge): void;
}

/** Get subject name from subject name, key name, or certificate name. */
declare function toSubjectName(name: Name): Name;

/** Convert string to UTF-8 byte array. */
declare function toUtf8(s: string): Uint8Array;

/**
 * Keep records on whether an event listener has been added.
 * @param target - EventTarget to override.
 * @returns Map from event type to whether listeners may exist.
 *
 * @remarks
 * This may allow `EventTarget` subclass to skip certain event generation code paths.
 * Tracking is imprecise: it does not consider `once()` and `removeEventListener()`.
 */
declare function trackEventListener(target: EventTarget): Record<string, boolean>;

/**
 * Low-level transport.
 *
 * @remarks
 * The transport understands NDN TLV structures, but does not otherwise concern with packet format.
 */
declare abstract class Transport {
    readonly attributes: Transport.Attributes;
    /**
     * Constructor.
     * @param attributes - Attributes of the transport.
     */
    protected constructor(attributes: Transport.Attributes);
    /**
     * Return the transport MTU.
     *
     * @remarks
     * The transport should be able to send TLV structure of up to this size.
     * If not overridden, return a conservative number.
     *
     * Note that this does not restrict incoming packet size.
     */
    get mtu(): number;
    /** Iterable of incoming packets received through the transport. */
    abstract readonly rx: Transport.RxIterable;
    /**
     * Function to accept outgoing packet stream.
     * @param iterable - Iterable of outgoing packets sent through the transport.
     * Size of each packet cannot exceed `.mtu`.
     * @returns Promise that resolves when iterable is exhausted or rejects upon error.
     */
    abstract tx(iterable: Transport.TxIterable): Promise<void>;
    /**
     * Reopen the transport after it has failed.
     * @returns The same transport or a new transport after it has been reconnected.
     *
     * @throws {@link \@ndn/l3face!Transport.ReopenNotSupportedError}
         * Thrown to indicate the transport does not support reopening.
         */
     reopen(): Promise<Transport>;
     toString(): string;
    }

    declare namespace Transport {
        interface Attributes extends Record<string, unknown> {
            /**
             * Textual description.
             * @defaultValue
             * Automatically generated from constructor name.
             */
            describe?: string;
            /**
             * Whether the transport connects to a destination on the local machine.
             * @defaultValue `false`
             */
            local?: boolean;
            /**
             * Whether the transport can possibly talk to multiple peers.
             * @defaultValue `false`
             */
            multicast?: boolean;
            [k: string]: unknown;
        }
        /** RX packet stream. */
        type RxIterable = AsyncIterable<Decoder.Tlv>;
        /** TX packet stream. */
        type TxIterable = AsyncIterable<Uint8Array>;
        /**
         * Error thrown by {@link Transport.reopen} to indicate that reopen operation is not supported.
         * No further `.reopen()` should be attempted.
         */
        class ReopenNotSupportedError extends Error {
            constructor();
        }
    }

    declare const TT: {
        readonly Name: 7;
        readonly GenericNameComponent: 8;
        readonly ImplicitSha256DigestComponent: 1;
        readonly ParametersSha256DigestComponent: 2;
        readonly Interest: 5;
        readonly CanBePrefix: 33;
        readonly MustBeFresh: 18;
        readonly ForwardingHint: 30;
        readonly Nonce: 10;
        readonly InterestLifetime: 12;
        readonly HopLimit: 34;
        readonly AppParameters: 36;
        readonly ISigInfo: 44;
        readonly ISigValue: 46;
        readonly Data: 6;
        readonly MetaInfo: 20;
        readonly ContentType: 24;
        readonly FreshnessPeriod: 25;
        readonly FinalBlock: 26;
        readonly Content: 21;
        readonly DSigInfo: 22;
        readonly DSigValue: 23;
        readonly SigType: 27;
        readonly KeyLocator: 28;
        readonly KeyDigest: 29;
        readonly SigNonce: 38;
        readonly SigTime: 40;
        readonly SigSeqNum: 42;
        readonly Nack: 800;
        readonly NackReason: 801;
    };

    declare type TypedEventListener<M, T extends keyof M> = (evt: M[T]) => void | Promise<void>;

    declare interface TypedEventListenerObject<M, T extends keyof M> {
        handleEvent: (evt: M[T]) => void | Promise<void>;
    }

    declare type TypedEventListenerOrEventListenerObject<M, T extends keyof M> = TypedEventListener<M, T> | TypedEventListenerObject<M, T>;

    declare interface TypedEventTarget<M extends ValueIsEvent<M>> {
        /** Appends an event listener for events whose type attribute value is type.
         * The callback argument sets the callback that will be invoked when the event
         * is dispatched.
         *
         * The options argument sets listener-specific options. For compatibility this
         * can be a boolean, in which case the method behaves exactly as if the value
         * was specified as options's capture.
         *
         * When set to true, options's capture prevents callback from being invoked
         * when the event's eventPhase attribute value is BUBBLING_PHASE. When false
         * (or not present), callback will not be invoked when event's eventPhase
         * attribute value is CAPTURING_PHASE. Either way, callback will be invoked if
         * event's eventPhase attribute value is AT_TARGET.
         *
         * When set to true, options's passive indicates that the callback will not
         * cancel the event by invoking preventDefault(). This is used to enable
         * performance optimizations described in § 2.8 Observing event listeners.
         *
         * When set to true, options's once indicates that the callback will only be
         * invoked once after which the event listener will be removed.
         *
         * The event listener is appended to target's event listener list and is not
         * appended if it has the same type, callback, and capture. */
        addEventListener: <T extends keyof M & string>(type: T, listener: TypedEventListenerOrEventListenerObject<M, T> | null, options?: boolean | AddEventListenerOptions) => void;
        /** Removes the event listener in target's event listener list with the same
         * type, callback, and options. */
        removeEventListener: <T extends keyof M & string>(type: T, callback: TypedEventListenerOrEventListenerObject<M, T> | null, options?: EventListenerOptions | boolean) => void;
        /**
         * Dispatches a synthetic event event to target and returns true if either
         * event's cancelable attribute value is false or its preventDefault() method
         * was not invoked, and false otherwise.
         * @deprecated To ensure type safety use `dispatchTypedEvent` instead.
         */
        dispatchEvent: (event: Event) => boolean;
    }

    declare class TypedEventTarget<M extends ValueIsEvent<M>> extends EventTarget {
        /**
         * Dispatches a synthetic event event to target and returns true if either
         * event's cancelable attribute value is false or its preventDefault() method
         * was not invoked, and false otherwise.
         */
        dispatchTypedEvent<T extends keyof M>(_type: T, event: M[T]): boolean;
    }

    /**
     * A function type interface that describes a function that accepts one parameter `T`
     * and returns another parameter `R`.
     *
     * Usually used to describe {@link OperatorFunction} - it always takes a single
     * parameter (the source Observable) and returns another Observable.
     */
    declare interface UnaryFunction<T, R> {
        (source: T): R;
    }

    declare interface Unsubscribable {
        unsubscribe(): void;
    }

    declare type Update = SyncUpdate<Name>;

    declare namespace util {
        export {
            assert,
            console_2 as console,
            concatBuffers,
            crypto_2 as crypto,
            delay,
            asUint8Array,
            asDataView,
            lock,
            Closer,
            Closers,
            timingSafeEqual,
            sha256,
            trackEventListener,
            CustomEvent_2 as CustomEvent,
            pushable,
            safeIter,
            flatMapOnce,
            evict,
            Pushable,
            KeyMap,
            KeyMultiMap,
            MultiMap,
            KeyMultiSet,
            constrain,
            Reorder,
            toHex,
            fromHex,
            toUtf8,
            fromUtf8,
            randomJitter
        }
    }
    export { util }

    declare type ValidateOptions<T, Repeat extends boolean, FlagBit extends string, R> = IfNever<FlagBit, R, Repeat extends true ? ErrFlags : T extends number ? R : ErrFlags>;

    /** Certificate validity period. */
    declare class ValidityPeriod {
        static decodeFrom(decoder: Decoder): ValidityPeriod;
        constructor();
        constructor(notBefore: ValidityPeriod.TimestampInput, notAfter: ValidityPeriod.TimestampInput);
        notBefore: number;
        notAfter: number;
        encodeTo(encoder: Encoder): void;
        /** Determine whether the specified timestamp is within validity period. */
        includes(t: ValidityPeriod.TimestampInput): boolean;
        /** Determine whether this validity period equals another. */
        equals({ notBefore, notAfter }: ValidityPeriod): boolean;
        /** Compute the intersection of this and other validity periods. */
        intersect(...validityPeriods: ValidityPeriod[]): ValidityPeriod;
        toString(): string;
    }

    declare namespace ValidityPeriod {
        type TimestampInput = number | Date;
        /** A very long ValidityPeriod. */
        const MAX: ValidityPeriod;
        /** Construct ValidityPeriod for n days from now. */
        function daysFromNow(n: number): ValidityPeriod;
        /** Retrieve ValidityPeriod from SigInfo. */
        function get(si: SigInfo): ValidityPeriod | undefined;
        /** Assign ValidityPeriod onto SigInfo. */
        function set(si: SigInfo, v?: ValidityPeriod): void;
    }

    declare type ValueIsEvent<T> = {
        [key in keyof T]: Event;
    };

    /** High level verifier, such as a named public key. */
    declare interface Verifier {
        /**
         * Verify a packet.
         * @returns Promise resolves upon good signature/policy or rejects upon bad signature/policy.
         */
        verify: (pkt: Verifier.Verifiable) => Promise<void>;
    }

    declare namespace Verifier {
        /** Target packet compatible with high level verifier. */
        interface Verifiable extends Readonly<PacketWithSignature>, LLVerify.Verifiable {
        }
        /**
         * Ensure packet has the correct SigType.
         *
         * @throws Error
         * Thrown if `pkt` lacks SigInfo or its SigType differs from `expectedSigType`.
         */
        function checkSigType(pkt: Readonly<PacketWithSignature>, expectedSigType: number): void;
        /** Throw bad signature error if not OK. */
        function throwOnBadSig(ok: boolean): asserts ok;
    }

    declare interface WasmFS {
        isFile(mode: number): boolean;
        isDir(mode: number): boolean;
        isLink(mode: number): boolean;
        mkdir(path: string, mode?: number): any;
        mkdev(path: string, mode?: number, dev?: number): any;
        symlink(oldpath: string, newpath: string): any;
        rename(old_path: string, new_path: string): void;
        rmdir(path: string): void;
        readdir(path: string): any;
        unlink(path: string): void;
        stat(path: string, dontFollow?: boolean): any;
        chmod(path: string, mode: number, dontFollow?: boolean): void;
        readFile(path: string, opts: {
            encoding: "binary";
            flags?: string | undefined;
        }): Uint8Array;
        readFile(path: string, opts: {
            encoding: "utf8";
            flags?: string | undefined;
        }): string;
        readFile(path: string, opts?: {
            flags?: string | undefined;
        }): Uint8Array;
        writeFile(path: string, data: string | ArrayBufferView, opts?: {
            flags?: string | undefined;
        }): void;
        cwd(): string;
        chdir(path: string): void;
    }

    declare namespace ws_transport {
        export {
            WsTransport
        }
    }
    export { ws_transport }

    /** WebSocket transport. */
    declare class WsTransport extends Transport {
        private readonly sock;
        private readonly opts;
        /**
         * Create a transport by connecting to WebSocket server or from existing WebSocket instance.
         * @param uri - Server URI or existing WebSocket instance.
         * @see {@link WsTransport.createFace}
         */
        static connect(uri: string | WebSocket | WebSocket_2, opts?: WsTransport.Options): Promise<WsTransport>;
        private constructor();
        /**
         * Report MTU as Infinity.
         * @see {@link https://stackoverflow.com/a/20658569}
         */
        get mtu(): number;
        readonly rx: Transport.RxIterable;
        private readonly highWaterMark;
        private readonly lowWaterMark;
        tx(iterable: Transport.TxIterable): Promise<void>;
        private waitForTxBuffer;
        close(): void;
        /** Reopen the transport by connecting again with the same options. */
        reopen(): Promise<WsTransport>;
    }

    declare namespace WsTransport {
        /** {@link WsTransport.connect} options. */
        interface Options {
            /**
             * Connect timeout (in milliseconds).
             * @defaultValue 10000
             */
            connectTimeout?: number;
            /**
             * Buffer amount (in bytes) to start TX throttling.
             * @defaultValue 1 MiB
             */
            highWaterMark?: number;
            /**
             * Buffer amount (in bytes) to stop TX throttling.
             * @defaultValue 16 KiB
             */
            lowWaterMark?: number;
        }
        /** Create a transport and add to forwarder. */
        const createFace: L3Face.CreateFaceFunc<[uri: string | WebSocket | WebSocket_2, opts?: Options | undefined]>;
    }

    export { }
