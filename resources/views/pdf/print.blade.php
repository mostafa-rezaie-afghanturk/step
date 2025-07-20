<!DOCTYPE html>
<html lang="en">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }}</title>

    <style>
        @font-face {
            font-family: 'DejaVuSans';
            src: url('{{ asset('fonts/DejaVuSans.ttf') }}');
        }

        body {
            font-family: 'DejaVuSans', sans-serif;
        }


        /* body {
            font-family: 'Vazir', Arial, sans-serif;
        } */

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 2px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }

        table {
            max-width: 2480px;
            width: 100%;
        }

        table td {
            width: auto;
            overflow: hidden;
            word-wrap: break-word;
        }
    </style>
</head>

<body>

    <h2 style="margin-bottom: 0;">{{ $title }}</h2>
    <p style="font-size: 6pt; color: #666;">
        Generated on {{ now()->format('F j, Y') }}
    </p>
    <table>
        <thead>
            <tr>
                @foreach ($headings as $heading)
                    <th style="font-size: 6pt; ">{{ $heading }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @foreach ($datas as $data)
                <tr style="font-size: 4pt;">
                    @foreach ($fields as $column)
                        <td style="font-size: 4pt;">
                            @if (str_contains($column, '.'))
                                {{-- Handle dot notation for nested properties --}}
                                {{ data_get($data, $column) ?? '' }} {{-- Use data_get to access nested properties --}}
                            @else
                                {{-- Handle direct properties --}}
                                {{ $data->{$column} ?? '' }} {{-- Default to empty string if not set --}}
                            @endif
                        </td>
                    @endforeach
                </tr>
            @endforeach
        </tbody>
    </table>

</body>

</html>
